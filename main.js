// console.log("Yoro está despertando...");

const dialogueContainer = document.querySelector(".dialogue-text");
const dialogueParagraph = dialogueContainer ? dialogueContainer.querySelector("p") : null;

const FADE_DURATION = 800; // debe coincidir con el "transition" de style.css

function showDialogue(lines) {
    if (!dialogueContainer || !dialogueParagraph) {
        console.warn("Contenedor o párrafo de diálogo no encontrado.");
        return;
    }

    let i = 0;
    function showNext() {
        if (i >= lines.length) return;
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

showDialogue(introDialogue);