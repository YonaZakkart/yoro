//guarda visitas (prueba)
const visits = Number(localStorage.getItem("yoro_visits")) || 0;
localStorage.setItem("yoro_visits", visits + 1);
console.log("Visitas:", visits + 1);

//obtiene los eventos ya completados
function getCompletedEvents() {
    const stored = localStorage.getItem("yoro_completed_events");
    return stored ? JSON.parse(stored) : [];
}
// si el dialogo es una funcion, la ejecuta; si ya es un arreglo, lo devuelve tal cual
function resolveDialogue(dialogue) {
    return typeof dialogue === "function" ? dialogue() : dialogue;
}

// permite confirmar con Enter en vez de solo hacer click
function enableEnterKey(inputElement, buttonElement) {
    inputElement.onkeydown = (event) => {
        if (event.key === "Enter") {
            buttonElement.click();
        }
    };
}

//marca los eventos como completos
function markEventCompleted(eventId) {
    const completed = getCompletedEvents();
    if (!completed.includes(eventId)) {
        completed.push(eventId);
        localStorage.setItem("yoro_completed_events", JSON.stringify(completed));
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
];

// busca el siguiente evnto sin completar
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

const nextEvent = findNextEvent();

if (nextEvent) {
    showDialogue(resolveDialogue(nextEvent.introDialogue), () => nextEvent.start(nextEvent));
} else {
    showDialogue(returningDialogue, showGameMenu);
}

// muestra el menu de seleccion de juego
function showGameMenu() {
    const menuUI = document.getElementById("game-menu-ui");
    const latestGames = getLatestGames();

    menuUI.innerHTML = "";

    latestGames.forEach(game => {
        const button = document.createElement("button");
        button.textContent = game.gameName;
        button.className = "px-4 py-2 rounded-lg bg-primary-container text-on-primary-container";

        button.onclick = () => {
            menuUI.classList.add("hidden");
            showDialogue(resolveDialogue(game.replayAcceptDialogue), () => game.start(game));
        };

        menuUI.appendChild(button);
    });

    menuUI.classList.remove("hidden");
}

// muestra el menu de seleccion de modo (generico, para cualquier evento con "modes")
function showModeMenu(event) {
    const modeMenuUI = document.getElementById("mode-menu-ui");
    modeMenuUI.innerHTML = "";

    event.modes.forEach(mode => {
        const wrapper = document.createElement("div");
        wrapper.className = "flex flex-col items-center gap-2 max-w-[160px] text-center";

        const button = document.createElement("button");
        button.textContent = mode.label;
        button.className = "px-4 py-2 rounded-lg bg-primary-container text-on-primary-container w-full";
        button.onclick = () => {
            modeMenuUI.classList.add("hidden");
            mode.start(event, mode.id);
        };

        const description = document.createElement("p");
        description.textContent = mode.description;
        description.className = "text-label-code font-label-code opacity-70";

        wrapper.appendChild(button);
        wrapper.appendChild(description);
        modeMenuUI.appendChild(wrapper);
    });

    modeMenuUI.classList.remove("hidden");
}

// Evento 1. Juego: Adivina el numero (1)
function startGuessingGame(event) {
    const secretNumber = pickSecretNumber(10);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    let attempts = 0;

    guessButton.addEventListener("click", () => {
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = `¡Lo lograste! :D`;
            guessInput.disabled = true;
            guessButton.disabled = true;

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    markEventCompleted(event.id);
                    showDialogue(event.outroDialogue);
                }, FADE_DURATION);
            }, 3200);
        } else {
            dialogueParagraph.textContent = `No es ese... (intento ${attempts})`;
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
        }
    });
}

//Evento 2. Juego: Adivina el numero 1.1
function startGuessingGame_1_1(event) {
    const secretNumber = pickSecretNumber(20);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    let attempts = 0;

    guessButton.onclick = () => {
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = getResultMessage(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    markEventCompleted(event.id);
                    showDialogue(event.outroDialogue);
                }, FADE_DURATION);
            }, 3200);
        } else {
            dialogueParagraph.textContent = guess < secretNumber ? "Más arriba..." : "Más abajo...";
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
        }
    };
}

//Evento 3. preguntaa el nombre al usuario
function askForName(event) {
    const nameUI = document.getElementById("name-ui");
    const nameInput = document.getElementById("name-input");
    const nameButton = document.getElementById("name-button");

    nameUI.classList.remove("hidden");
    enableEnterKey(nameInput, nameButton);

    nameButton.onclick = () => {
        const name = nameInput.value.trim();
        if (!name) return;

        localStorage.setItem("yoro_player_name", name);
        nameUI.classList.add("hidden");

        showDialogue(buildNameDialogue(name), () => {
            markEventCompleted(event.id);
        });
    };
}

//Evento 4. Logica del juego, compartida entre ambos modos
function runGuessingGame_1_2(event, mode) {
    let secretNumber = pickSecretNumber(50);
    let failStreak = 0;

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    let attempts = 0;

    guessButton.onclick = () => {
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = mode === "casual"
                ? getResultMessageCasual(attempts)
                : getResultMessageDesafio(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    markEventCompleted(event.id);
                    showDialogue(resolveDialogue(event.outroDialogue));
                }, FADE_DURATION);
            }, 3200);
        } else {
            if (mode === "casual") {
                dialogueParagraph.textContent = getHintCasual(secretNumber, guess);
            } else {
                const result = handleDesafioFail(secretNumber, failStreak);
                secretNumber = result.secretNumber;
                failStreak = result.failStreak;

                const hint = guess < secretNumber ? "Más arriba..." : "Más abajo...";
                dialogueParagraph.textContent = result.changed
                    ? `El número secreto ha cambiado... Ahora está ${hint}`
                    : hint;
            }
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
        }
    };
}

// Evento 5. Juego: Cuenta Conmigo (suma y resta)
function startMathGame(event) {
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    const totalProblems = 5;
    let problemIndex = 0;
    let hits = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem();
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
    }

    function finishGame() {
        const result = getMathResultMessage(hits, totalProblems);
        dialogueParagraph.textContent = result.text;
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                markEventCompleted(event.id);
                showDialogue(resolveDialogue(event.outroDialogue));
            }, FADE_DURATION);
        }, 3200);
    }

    guessButton.onclick = () => {
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;
        if (correct) hits++;
        problemIndex++;

        dialogueParagraph.textContent = correct ? "¡Correcto!" : `Casi... era ${currentProblem.answer}`;
        dialogueContainer.style.opacity = 1;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                if (problemIndex >= totalProblems) {
                    finishGame();
                } else {
                    showProblem();
                }
            }, FADE_DURATION);
        }, 1500);
    };

    showProblem();
}

// Evento 6. Modo Casual: 10 preguntas, rango mayor
function runMathGameCasual(event) {
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    const totalProblems = 10;
    const maxRange = 50;
    let problemIndex = 0;
    let hits = 0;
    let racha = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem(maxRange);
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
    }

    function finishGame() {
        const result = getMathResultMessage10(hits);
        dialogueParagraph.textContent = result.text;
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                markEventCompleted(event.id);
                showDialogue(resolveDialogue(event.outroDialogue));
            }, FADE_DURATION);
        }, 3200);
    }

    guessButton.onclick = () => {
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;

        if (correct) {
            hits++;
            racha++;
            dialogueParagraph.textContent = `¡Correcto! (racha: ${racha})`;
        } else {
            racha = 0;
            dialogueParagraph.textContent = `Casi... era ${currentProblem.answer}`;
        }

        problemIndex++;
        dialogueContainer.style.opacity = 1;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                if (problemIndex >= totalProblems) {
                    finishGame();
                } else {
                    showProblem();
                }
            }, FADE_DURATION);
        }, 1500);
    };

    showProblem();
}

// Evento 6. Modo Infinito: sin limite de preguntas, termina al primer fallo
function runMathGameInfinito(event) {
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    const maxRange = 50;
    let attempts = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem(maxRange);
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
    }

    function finishGame() {
        dialogueParagraph.textContent = `Fallaste... realizaste ${attempts} ejercicios ¡Fueron ${attempts-1} aciertos!`;
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                markEventCompleted(event.id);
                showDialogue(resolveDialogue(event.outroDialogue));
            }, FADE_DURATION);
        }, 4200);
    }

    guessButton.onclick = () => {
        const answer = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (answer === currentProblem.answer) {
            dialogueParagraph.textContent = `¡Correcto! van ${attempts} aciertos seguidos`;
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(showProblem, FADE_DURATION);
            }, 1200);
        } else {
            finishGame();
        }
    };

    showProblem();
}

// guarda titulo original
const originalTitle = document.title;
let awayTimeout1;
let awayTimeout2;

//cambia el titulo al salir de la pestania
document.addEventListener("visibilitychange", () => {
    clearTimeout(awayTimeout1);
    clearTimeout(awayTimeout2);

    if (document.hidden) {
        awayTimeout1 = setTimeout(() => {
            document.title = "¿Te vas...?";
        }, 2000);

        awayTimeout2 = setTimeout(() => {
            document.title = "¿Sigues ahí...?";
        }, 12000);
    } else {
        document.title = originalTitle;
    }
});