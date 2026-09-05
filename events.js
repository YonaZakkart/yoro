// Motor de eventos y dialogos de Yoro: arreglo de eventos, sistema de dialogo (fade + skip),
// menus dinamicos (juegos, modos, seguir jugando) y dialogos ociosos.

// obtiene los eventos ya completados
function getCompletedEvents() {
    const stored = localStorage.getItem("yoro_completed_events");
    return stored ? JSON.parse(stored) : [];
}

// si el dialogo es una funcion, la ejecuta; si ya es un arreglo, lo devuelve tal cual
function resolveDialogue(dialogue) {
    return typeof dialogue === "function" ? dialogue() : dialogue;
}

//marca los eventos como completos
function markEventCompleted(eventId) {
    const completed = getCompletedEvents();
    if (!completed.includes(eventId)) {
        completed.push(eventId);
        localStorage.setItem("yoro_completed_events", JSON.stringify(completed));
    }
}

// muestra el outro de un evento; si ya se habia completado antes (repeticion desde el menu),
// al terminar pregunta si el jugador quiere seguir jugando en vez de pasar directo a los dialogos ociosos
function finishEvent(event) {
    const alreadyCompleted = getCompletedEvents().includes(event.id);
    markEventCompleted(event.id);

    if (alreadyCompleted) {
        showDialogue(replayOutroDialogue, () => {
            showDialogue(askContinueDialogue, showContinueMenu);
        });
    } else {
        showDialogue(resolveDialogue(event.outroDialogue), startIdleDialogues);
    }
}

//lista de eventos
const events = [
    {   //evento 1. Inicio number_game 1
        id: "event_1_number_game",
        gameId: "guess_number",
        gameName: "Adivina el Número",
        introDialogue: introDialogue,
        outroDialogue: outroDialogue,
        replayAcceptDialogue: confirmYesDialogue,
        replayDeclineDialogue: confirmNoDialogue,
        start: startGuessingGame,
        isGame: true
    },
    {   //evento 2. number_game 1.1
        id: "event_2_number_game_1_1",
        gameId: "guess_number",
        gameName: "Adivina el Número 1.1",
        introDialogue: introDialogue2,
        outroDialogue: outroDialogue2,
        replayAcceptDialogue: replayAcceptDialogue2,
        replayDeclineDialogue: replayDeclineDialogue2,
        start: startGuessingGame_1_1,
        isGame: true
    },
    {   //evento 3. Pregunta el nombre
        id: "event_3_player_name",
        introDialogue: introDialogue3,
        start: askForName
    },
    {   //evento 4. number_game 1.2
        id: "event_4_number_game_1_2",
        gameId: "guess_number",
        gameName: "Adivina el Número 1.2",
        introDialogue: buildIntroDialogue4,
        outroDialogue: buildOutroDialogue4,
        replayAcceptDialogue: replayAcceptDialogue4,
        replayDeclineDialogue: replayDeclineDialogue4,
        modes: [
            { id: "casual", label: "Casual", description: "Pistas más detalladas según qué tan cerca estés", start: runGuessingGame_1_2 },
            { id: "desafio", label: "Desafío", description: "Pistas simples, pero el número escapa si fallas demasiado", start: runGuessingGame_1_2 }
        ],
        start: showModeMenu,
        isGame: true
    },
    {   //evento 5. Cuenta Conmigo
        id: "event_5_math_game",
        gameId: "cuenta_conmigo",
        gameName: "Cuenta Conmigo",
        introDialogue: buildIntroDialogue5,
        outroDialogue: buildOutroDialogue5,
        replayAcceptDialogue: replayAcceptDialogue5,
        replayDeclineDialogue: replayDeclineDialogue5,
        start: startMathGame,
        isGame: true
    },
    {   //evento 6. Cuenta Conmigo 1.1
        id: "event_6_math_game_1_1",
        gameId: "cuenta_conmigo",
        gameName: "Cuenta Conmigo 1.1",
        introDialogue: buildIntroDialogue6,
        outroDialogue: buildOutroDialogue6,
        replayAcceptDialogue: replayAcceptDialogue6,
        replayDeclineDialogue: replayDeclineDialogue6,
        modes: [
            { id: "casual", label: "Casual", description: "10 preguntas, números más grandes", start: runMathGameCasual },
            { id: "infinito", label: "Infinito", description: "Sigue mientras aciertes, termina hasta que falles", start: runMathGameInfinito }
        ],
        start: showModeMenu,
        isGame: true
    },
    {   //evento 7. Ahorcado (version base)
        id: "event_7_hangman",
        gameId: "ahorcado",
        gameName: "Ahorcado",
        introDialogue: buildIntroDialogue7,
        outroDialogue: buildOutroDialogue7,
        replayAcceptDialogue: replayAcceptDialogue7,
        replayDeclineDialogue: replayDeclineDialogue7,
        start: startHangmanGame,
        isGame: true
    },
    {   //evento 8. Ahorcado 1.1 (modos Casual y Desafio)
        id: "event_8_hangman_1_1",
        gameId: "ahorcado",
        gameName: "Ahorcado 1.1",
        introDialogue: buildIntroDialogue8,
        outroDialogue: buildOutroDialogue8,
        replayAcceptDialogue: replayAcceptDialogue8,
        replayDeclineDialogue: replayDeclineDialogue8,
        modes: [
            { id: "casual", label: "Casual", description: "15 intentos fijos; letras y palabra completa cuestan igual", start: runHangmanGame_1_1 },
            { id: "desafio", label: "Desafío", description: "Intentos aleatorios (12-16); un único intento para adivinar la palabra completa", start: runHangmanGame_1_1 }
        ],
        start: showModeMenu,
        isGame: true
    },
];

// busca el siguiente evento sin completar
function findNextEvent() {
    const completed = getCompletedEvents();
    return events.find(event => !completed.includes(event.id)) || null;
}

// devuelve solo la version mas reciente de cada juego (por gameId)
function getLatestGames() {
    const games = events.filter(event => event.isGame);
    const latestByFamily = {};

    games.forEach(game => {
        latestByFamily[game.gameId] = game;
    });

    return Object.values(latestByFamily);
}

const dialogueContainer = document.querySelector(".dialogue-text");
const dialogueParagraph = dialogueContainer ? dialogueContainer.querySelector("p") : null;

const FADE_DURATION = 800; // debe coincidir con el "transition" de style.css

// controla si se puede saltar la pausa actual del dialogo con un click
let dialogueSkipTimeout = null;
let dialogueSkippable = false;
let advanceDialogue = null; // referencia a la funcion "avanzar ya" de la linea actual

// click en cualquier parte de la pantalla salta la pausa (el fade se respeta igual)
document.addEventListener("click", () => {
    cancelIdleDialogues();

    if (dialogueSkippable && advanceDialogue) {
        clearTimeout(dialogueSkipTimeout);
        advanceDialogue();
    }
});

// muestra dialogo en la pantalla
function showDialogue(lines, onComplete) {
    if (!dialogueContainer || !dialogueParagraph) {
        console.warn("Contenedor o párrafo de diálogo no encontrado.");
        return;
    }

    let i = 0;
    function advance() {
        dialogueSkippable = false;
        dialogueContainer.style.opacity = 0;
        setTimeout(showNext, FADE_DURATION);
    }
    function showNext() {
        if (i >= lines.length) {
            dialogueSkippable = false;
            if (onComplete) onComplete();
            return;
        }
        const line = lines[i];
        dialogueParagraph.textContent = line.text;
        dialogueContainer.style.opacity = 1;
        i++;
        advanceDialogue = advance;
        dialogueSkippable = true;
        dialogueSkipTimeout = setTimeout(advance, line.pause);
    }
    setTimeout(showNext, 1000);
}

// Frases de relleno para cuando Yoro "piensa" entre una curiosidad y otra
const idleFillers = [". . .", "trabajando...", "hmm...", "bleh :b", "Guardando datos...", "Revisando detalles..."];

// Arma la lista de curiosidades disponibles ahora mismo, a partir de las estadisticas actuales
function getAvailableCuriosities() {
    const n = stats.games.number;
    const c = stats.games.countWithMe;
    const totalPlays = n.plays + c.plays;

    const list = [
        `Haz entrado ${stats.visits} veces`,
        n.plays > 0 ? `Jugamos "Adivina el Número" ${n.plays} veces` : null,
        n.bestAttempts !== null ? `Tu mejor partida de "Adivina el Número" fue en ${n.bestAttempts} intentos` : null,
        c.plays > 0 ? `Jugamos "Cuenta Conmigo" ${c.plays} veces` : null,
        c.bestTen !== null ? `Tu mejor puntaje en modo 10 fue ${c.bestTen}/10` : null,
        c.bestInfinite !== null ? `Tu mejor racha en modo Infinito fue de ${c.bestInfinite}` : null,
        c.totalAnswers > 0 ? `He recibido ${c.totalAnswers} respuestas en total` : null,
        totalPlays > 0 ? `En total hemos jugado ${totalPlays} partidas` : null
    ];

    return list.filter(text => text !== null);
}

// Mezcla un arreglo sin modificar el original (Fisher-Yates)
function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Sistema de dialogo ocioso: Yoro comenta cosas cuando la pantalla queda en silencio
let idleTimeouts = [];

function cancelIdleDialogues() {
    idleTimeouts.forEach(clearTimeout);
    idleTimeouts = [];
}

function startIdleDialogues() {
    cancelIdleDialogues(); // evita que se solapen dos secuencias

    const gaps = [6000, 8000, 10000, 12000, 15000, 18000];
    const repeatGap = 24000;
    const messageDuration = 3000;

    const curiosities = shuffleArray(getAvailableCuriosities());
    if (curiosities.length === 0) return; // todavia no hay nada que decir

    const queue = [];
    curiosities.forEach(stat => {
        queue.push(stat);
        queue.push(idleFillers[Math.floor(Math.random() * idleFillers.length)]);
    });

    let elapsed = 0;
    queue.forEach((text, index) => {
        const gap = gaps[index] !== undefined ? gaps[index] : repeatGap;
        elapsed += gap;

        const showId = setTimeout(() => {
            dialogueParagraph.textContent = text;
            dialogueContainer.style.opacity = 1;

            const hideId = setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, messageDuration);
            idleTimeouts.push(hideId);
        }, elapsed);

        idleTimeouts.push(showId);
        elapsed += messageDuration;
    });
}

// muestra el menu de seleccion de juego
let latestGamesList = [];

function showGameMenu() {
    const menuUI = document.getElementById("game-menu-ui");
    latestGamesList = getLatestGames();

    menuUI.innerHTML = "";

    latestGamesList.forEach(game => {
        const button = document.createElement("button");
        button.textContent = game.gameName;
        button.className = "px-4 py-2 rounded-lg bg-primary-container text-on-primary-container";
        button.dataset.gameId = game.gameId;

        menuUI.appendChild(button);
    });

    menuUI.classList.remove("hidden");
    startIdleDialogues();
}

document.getElementById("game-menu-ui").onclick = (clickEvent) => {
    const button = clickEvent.target.closest("button[data-game-id]");
    if (!button) return;

    const game = latestGamesList.find(g => g.gameId === button.dataset.gameId);
    if (!game) return;

    document.getElementById("game-menu-ui").classList.add("hidden");
    showDialogue(resolveDialogue(game.replayAcceptDialogue), () => game.start(game));
};

// muestra el menu de seleccion de modo (generico, para cualquier evento con "modes")
let currentModeMenuEvent = null;

function showModeMenu(event) {
    const modeMenuUI = document.getElementById("mode-menu-ui");
    currentModeMenuEvent = event;
    modeMenuUI.innerHTML = "";

    event.modes.forEach(mode => {
        const wrapper = document.createElement("div");
        wrapper.className = "flex flex-col items-center gap-2 max-w-[160px] text-center";

        const button = document.createElement("button");
        button.textContent = mode.label;
        button.className = "px-4 py-2 rounded-lg bg-primary-container text-on-primary-container w-full";
        button.dataset.modeId = mode.id;

        const description = document.createElement("p");
        description.textContent = mode.description;
        description.className = "text-label-code font-label-code opacity-70";

        wrapper.appendChild(button);
        wrapper.appendChild(description);
        modeMenuUI.appendChild(wrapper);
    });

    modeMenuUI.classList.remove("hidden");
}

document.getElementById("mode-menu-ui").onclick = (clickEvent) => {
    const button = clickEvent.target.closest("button[data-mode-id]");
    if (!button || !currentModeMenuEvent) return;

    const mode = currentModeMenuEvent.modes.find(m => m.id === button.dataset.modeId);
    if (!mode) return;

    document.getElementById("mode-menu-ui").classList.add("hidden");
    mode.start(currentModeMenuEvent, mode.id);
};

// muestra el mini-menu de "seguir jugando" (tras repetir un juego desde el menu)
function showContinueMenu() {
    document.getElementById("continue-menu-ui").classList.remove("hidden");
}

document.getElementById("continue-yes-button").onclick = () => {
    document.getElementById("continue-menu-ui").classList.add("hidden");
    showGameMenu();
};

document.getElementById("continue-later-button").onclick = () => {
    document.getElementById("continue-menu-ui").classList.add("hidden");
    showDialogue(continueLaterDialogue, startIdleDialogues);
};

// Arranca el flujo: busca el siguiente evento sin completar y lo reproduce
const nextEvent = findNextEvent();

if (nextEvent) {
    showDialogue(resolveDialogue(nextEvent.introDialogue), () => nextEvent.start(nextEvent));
} else {
    showDialogue(returningDialogue, showGameMenu);
}