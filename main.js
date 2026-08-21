// console.log("Yoro está despertando...");

const visits = Number(localStorage.getItem("yoro_visits")) || 0;
localStorage.setItem("yoro_visits", visits + 1);
console.log("Visitas:", visits + 1);

function getCompletedEvents() {
    const stored = localStorage.getItem("yoro_completed_events");
    return stored ? JSON.parse(stored) : [];
}

function markEventCompleted(eventId) {
    const completed = getCompletedEvents();
    if (!completed.includes(eventId)) {
        completed.push(eventId);
        localStorage.setItem("yoro_completed_events", JSON.stringify(completed));
    }
}

const events = [
    {
        id: "event_1_number_game",
        introDialogue: introDialogue,
        outroDialogue: outroDialogue,
        replayAcceptDialogue: confirmYesDialogue,
        replayDeclineDialogue: confirmNoDialogue,
        start: startGuessingGame
    },
    {
        id: "event_2_number_game_1_1",
        introDialogue: introDialogue2,
        outroDialogue: outroDialogue2,
        replayAcceptDialogue: replayAcceptDialogue2,
        replayDeclineDialogue: replayDeclineDialogue2,
        start: startGuessingGame_1_1
    }
];

function findNextEvent() {
    const completed = getCompletedEvents();
    return events.find(event => !completed.includes(event.id)) || null;
}

const dialogueContainer = document.querySelector(".dialogue-text");
const dialogueParagraph = dialogueContainer ? dialogueContainer.querySelector("p") : null;

const FADE_DURATION = 800; // debe coincidir con el "transition" de style.css

function showDialogue(lines, onComplete) {
    if (!dialogueContainer || !dialogueParagraph) {
        console.warn("Contenedor o párrafo de diálogo no encontrado.");
        return;
    }

    let i = 0;
    function showNext() {
        if (i >= lines.length) {
            if (onComplete) onComplete();
            return;
        }
        const line = lines[i];
        dialogueParagraph.textContent = line.text;
        dialogueContainer.style.opacity = 1;
        i++;
        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(showNext, FADE_DURATION);
        }, line.pause);
    }
    setTimeout(showNext, 1000);
}

const nextEvent = findNextEvent();

if (nextEvent) {
    showDialogue(nextEvent.introDialogue, () => nextEvent.start(nextEvent));
} else {
    showDialogue(returningDialogue, showReplayChoice);
}

function showReplayChoice() {
    const choiceUI = document.getElementById("choice-ui");
    const yesButton = document.getElementById("choice-yes");
    const noButton = document.getElementById("choice-no");

    choiceUI.classList.remove("hidden");

    const latestEvent = events[events.length - 1];

    yesButton.addEventListener("click", () => {
        choiceUI.classList.add("hidden");
        showDialogue(latestEvent.replayAcceptDialogue, () => latestEvent.start(latestEvent));
    }, { once: true });

    noButton.addEventListener("click", () => {
        choiceUI.classList.add("hidden");
        showDialogue(latestEvent.replayDeclineDialogue);
    }, { once: true });
}

function startGuessingGame(event) {
    const secretNumber = pickSecretNumber(10);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");

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

function startGuessingGame_1_1(event) {
    const secretNumber = pickSecretNumber(20);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");

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

const originalTitle = document.title;
let awayTimeout1;
let awayTimeout2;

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