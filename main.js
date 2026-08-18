// console.log("Yoro está despertando...");

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

showDialogue(introDialogue, startGuessingGame);

function startGuessingGame() {
    const secretNumber = pickSecretNumber();
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
                    showDialogue(outroDialogue);
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