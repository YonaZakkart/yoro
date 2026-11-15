// Entrada principal de Yoro: registra la visita y ofrece las utilidades compartidas
// por los juegos (input comun, mensajes cortos), el Evento 3 (nombre) y el titulo de la pestaña.
// Los juegos viven en js/games/, los paneles en js/ui/ y el motor de eventos en js/events.js.

// carga estadisticas y registra la visita actual
const stats = loadStats();
stats.visits++;

// cuenta un dia nuevo solo si la ultima visita registrada fue en otra fecha
const today = getTodayKey();
if (stats.firstVisitDay === null) {
    stats.firstVisitDay = today;
}
if (stats.lastVisitDay !== today) {
    stats.daysVisited++;
    stats.lastVisitDay = today;
}

saveStats(stats);
console.log("Visitas:", stats.visits);

// permite confirmar con Enter en vez de solo hacer click
function enableEnterKey(inputElement, buttonElement) {
    inputElement.onkeydown = (event) => {
        if (event.key === "Enter") {
            buttonElement.click();
        }
    };
}

// Prepara el input y el boton compartidos (#guess-input / #guess-button) al empezar cualquier juego:
// los reactiva, limpia el valor anterior y ajusta tipo, placeholder y texto del boton,
// para que no quede nada del juego anterior (por ejemplo, el placeholder del Ahorcado).
// Los data-i18n hacen que un cambio de idioma a mitad de partida traduzca el texto correcto.
function setupGameInput({ type, placeholderKey, buttonKey }) {
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    guessInput.type = type;
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.dataset.i18nPlaceholder = placeholderKey;
    guessInput.placeholder = t(placeholderKey);
    guessButton.dataset.i18n = buttonKey;
    guessButton.textContent = t(buttonKey);
    guessButton.disabled = false;
    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);

    return { gameUI, guessInput, guessButton };
}

// Recuerda si hay un mensaje corto visible ahora mismo (y su temporizador para ocultarse).
// null = no hay ninguno visible.
let quickMessageTimeout = null;
let quickRestoreTimeout = null;

// Muestra un mensaje corto y transitorio de Yoro
// Si el mensaje anterior todavia esta visible, el texto cambia al instante sin fade 
//  Si ya se habia ocultado, aparece con el fade normal.
function showQuickMessage(text, { duration = 2000, restoreText = null } = {}) {
    const yaEstaVisible = quickMessageTimeout !== null;
    clearTimeout(quickMessageTimeout);
    clearTimeout(quickRestoreTimeout); // cancela una restauracion pendiente de un aviso anterior
    quickRestoreTimeout = null;

    dialogueParagraph.textContent = text;
    if (!yaEstaVisible) {
        dialogueContainer.style.opacity = 1;
    }

    quickMessageTimeout = setTimeout(() => {
        dialogueContainer.style.opacity = 0;
        quickMessageTimeout = null;

        if (restoreText) {
            quickRestoreTimeout = setTimeout(() => {
                dialogueParagraph.textContent = restoreText;
                dialogueContainer.style.opacity = 1;
                quickRestoreTimeout = null;
            }, FADE_DURATION);
        }
    }, duration);
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
        if (name.length < 3) {
            showQuickMessage(t("name_too_short"));
            return;
        }

        savePlayerName(name);
        nameUI.classList.add("hidden");

        showDialogue(withGesture(nameDialogue3, -1, "wave"), () => {
            markEventCompleted(event.id);
            startIdleDialogues();
            showSkipTimeButton();
        });
    };
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
            document.title = t("tab_away_1");
        }, 2000);

        awayTimeout2 = setTimeout(() => {
            document.title = t("tab_away_2");
        }, 12000);
    } else {
        document.title = originalTitle;
    }
});
