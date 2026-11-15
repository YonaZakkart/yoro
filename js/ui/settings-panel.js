// Panel de Opciones (engranaje): idioma, cambiar nombre, reiniciar estadisticas y reiniciar juego.

// Panel de opciones (engranaje): cubre toda la pantalla mientras esta abierto
const settingsButton = document.getElementById("settings-button");
const settingsPanel = document.getElementById("settings-panel");
const settingsCloseButton = document.getElementById("settings-close-button");

function openSettingsPanel() {
    // quita el foco del input del juego, para que Enter no dispare el boton de abajo
    if (document.activeElement) document.activeElement.blur();
    showSettingsOptions();
    changeNameOption.classList.toggle("hidden", !getPlayerName());
    updateLanguageButtonText();
    settingsPanel.classList.remove("hidden");
    syncDialoguePause();
}

function closeSettingsPanel() {
    settingsPanel.classList.add("hidden");
    syncDialoguePause();
}

// Los clicks de aqui no deben llegar al listener global de events.js,
// o saltarian la pausa del dialogo que haya detras.
settingsButton.onclick = (clickEvent) => {
    clickEvent.stopPropagation();
    openSettingsPanel();
};
settingsPanel.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
settingsCloseButton.onclick = closeSettingsPanel;

// Selector de idioma en panel de opciones
const languageButton = document.getElementById("language-button");
const languageDropdown = document.getElementById("language-dropdown");

let languageDropdownOpen = false;

function updateLanguageButtonText() {
    const languageButtonText = document.getElementById("language-button-text");
    if (!languageButtonText) return;
    const current = getCurrentLang();
    languageButtonText.textContent = `· ${t(current === "es" ? "lang_spanish" : "lang_english")}`;
}

function toggleLanguageDropdown() {
    languageDropdownOpen = !languageDropdownOpen;
    languageDropdown.classList.toggle("hidden", !languageDropdownOpen);
    languageButton.setAttribute("aria-expanded", languageDropdownOpen);

    if (languageDropdownOpen) {
        setTimeout(() => {
            document.addEventListener("click", closeLanguageDropdownOutside, { once: true });
        }, 0);
    }
}

function closeLanguageDropdownOutside(clickEvent) {
    if (!languageButton.contains(clickEvent.target) && !languageDropdown.contains(clickEvent.target)) {
        languageDropdownOpen = false;
        languageDropdown.classList.add("hidden");
        languageButton.setAttribute("aria-expanded", "false");
    } else {
        document.addEventListener("click", closeLanguageDropdownOutside, { once: true });
    }
}

languageButton.onclick = (e) => {
    e.stopPropagation();
    toggleLanguageDropdown();
};

languageDropdown.querySelectorAll("[data-lang]").forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        if (lang !== getCurrentLang()) {
            setLang(lang);
            updateLanguageButtonText();
            updateMusicButton();
            settingsMessage.textContent = "";
        }
        languageDropdownOpen = false;
        languageDropdown.classList.add("hidden");
        languageButton.setAttribute("aria-expanded", "false");
    };
});

// Opcion "Cambiar mi nombre" del panel de opciones
const settingsOptions = document.getElementById("settings-options");
const settingsNameForm = document.getElementById("settings-name-form");
const settingsNameInput = document.getElementById("settings-name-input");
const settingsNameSave = document.getElementById("settings-name-save");
const settingsNameCancel = document.getElementById("settings-name-cancel");
const settingsMessage = document.getElementById("settings-message");
const changeNameOption = document.querySelector('[data-option="change-name"]');

enableEnterKey(settingsNameInput, settingsNameSave);

// vuelve a la lista de opciones y limpia el mensaje
function showSettingsOptions() {
    settingsNameForm.classList.add("hidden");
    settingsConfirm.classList.add("hidden");
    settingsOptions.classList.remove("hidden");
    settingsMessage.textContent = "";
    pendingConfirmAction = null;
    pendingDeclineAction = null;
}

changeNameOption.onclick = () => {
    settingsMessage.textContent = "";
    settingsOptions.classList.add("hidden");
    settingsNameForm.classList.remove("hidden");
    settingsNameInput.value = getPlayerName();
    settingsNameInput.focus();
};

settingsNameCancel.onclick = showSettingsOptions;

settingsNameSave.onclick = () => {
    const name = settingsNameInput.value.trim();
    if (name.length < 3) {
        settingsMessage.textContent = t("name_too_short");
        return;
    }

    const previousName = getPlayerName();
    savePlayerName(name);
    showSettingsOptions();

    // mismo nombre: Yoro no finge que es uno nuevo
    if (name === previousName) {
        settingsMessage.textContent = t("settings_same_name", { name });
        return;
    }

    const reactionKeys = ["settings_react_1", "settings_react_2", "settings_react_3"];
    const randomKey = reactionKeys[Math.floor(Math.random() * reactionKeys.length)];
    settingsMessage.textContent = t(randomKey, { name });
};

// Confirmacion generica del panel de opciones (para acciones que borran datos)
const settingsConfirm = document.getElementById("settings-confirm");
const settingsConfirmText = document.getElementById("settings-confirm-text");
const settingsConfirmAccept = document.getElementById("settings-confirm-accept");
const settingsConfirmCancel = document.getElementById("settings-confirm-cancel");
const resetStatsOption = document.querySelector('[data-option="reset-stats"]');
const resetGameOption = document.querySelector('[data-option="reset-game"]');

// acciones pendientes segun el boton que se pulse (null = no hay ninguna)
let pendingConfirmAction = null;
let pendingDeclineAction = null;

// Muestra la confirmacion. Opciones: textos de los botones y "onCancel":
// si se pasa, el boton izquierdo ejecuta esa accion (despues de volver a la lista de opciones)
function showSettingsConfirm(text, onAccept, { acceptLabel = t("btn_accept"), cancelLabel = t("btn_cancel"), onCancel = null } = {}) {
    settingsMessage.textContent = "";
    pendingConfirmAction = onAccept;
    pendingDeclineAction = onCancel;
    settingsConfirmText.textContent = text;
    settingsConfirmAccept.textContent = acceptLabel;
    settingsConfirmCancel.textContent = cancelLabel;
    settingsOptions.classList.add("hidden");
    settingsConfirm.classList.remove("hidden");
}

settingsConfirmCancel.onclick = () => {
    const action = pendingDeclineAction; // se guarda antes, porque showSettingsOptions la borra
    showSettingsOptions();
    if (action) action();
};

settingsConfirmAccept.onclick = () => {
    const action = pendingConfirmAction;
    showSettingsOptions();
    if (action) action();
};

resetStatsOption.onclick = () => {
    showSettingsConfirm(t("settings_reset_stats_confirm"), () => {
        // se cambia el contenido del mismo objeto "stats" (no se crea uno nuevo),
        // para que todo el codigo que ya lo usa vea los datos reiniciados
        Object.assign(stats, createInitialStats());
        stats.visits = 1;
        stats.daysVisited = 1;
        stats.lastVisitDay = getTodayKey();
        stats.firstVisitDay = getTodayKey();
        saveStats(stats);
        settingsMessage.textContent = t("settings_reset_stats_done");
    });
};

// Borra el progreso (eventos completados y nombre) y recarga la pagina para que Yoro empiece de cero.
// Las estadisticas solo se reinician si resetStatsToo es true.
function resetGame(resetStatsToo) {
    removeStorage("yoro_completed_events");
    removeStorage("yoro_player_name");

    if (resetStatsToo) {
        // visits queda en 0 porque la recarga de abajo ya suma la visita nueva
        Object.assign(stats, createInitialStats());
        saveStats(stats);
    }

    location.reload();
}

resetGameOption.onclick = () => {
    showSettingsConfirm(t("settings_reset_game_confirm"), () => resetGame(false), {
        acceptLabel: t("btn_yes"),
        cancelLabel: t("btn_no"),
        onCancel: () => resetGame(true)
    });
};
