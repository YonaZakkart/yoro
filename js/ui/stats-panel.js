// Panel de Estadisticas (grafico): vista general y pantallas de detalle por juego.

// Panel de estadisticas (boton de grafico): cubre toda la pantalla mientras esta abierto
const statsButton = document.getElementById("stats-button");
const statsPanel = document.getElementById("stats-panel");
const statsCloseButton = document.getElementById("stats-close-button");
const statsGeneralList = document.getElementById("stats-general-list");

// claves de los nombres de los juegos, con las mismas claves que stats.games
const gameNameKeys = {
    number: "game_guess_number",
    countWithMe: "game_cuenta_conmigo",
    hangman: "game_ahorcado"
};

// convierte "2026-10-14" en "14/10/2026" (o un guion si todavia no hay fecha)
function formatStatDate(dayKey) {
    if (!dayKey) return "—";
    const [year, month, day] = dayKey.split("-");
    return `${day}/${month}/${year}`;
}

// el juego con mas plays; en caso de empate gana el primero de la lista; sin partidas, un guion
function getMostPlayedGame() {
    let bestKey = null;
    let bestPlays = 0;

    Object.keys(gameNameKeys).forEach(key => {
        const plays = stats.games[key].plays;
        if (plays > bestPlays) {
            bestPlays = plays;
            bestKey = key;
        }
    });

    return bestKey === null ? "—" : t(gameNameKeys[bestKey]);
}

// arma las filas de la vista general con los datos actuales
function renderStatsGeneral() {
    const games = stats.games;
    const totalPlays = games.number.plays + games.countWithMe.plays + games.hangman.plays;
    const winRate = formatPercent(games.hangman.wins, games.hangman.plays);
    const playerName = getPlayerName() || "—";

    const rows = [
        [t("stat_name"), playerName],
        [t("stat_visits"), stats.visits],
        [t("stat_days_visited"), stats.daysVisited],
        [t("stat_first_visit"), formatStatDate(stats.firstVisitDay)],
        [t("stat_total_games"), totalPlays],
        [t("stat_most_played"), getMostPlayedGame()],
        [t("stat_win_rate_hangman"), winRate]
    ];

    fillStatRows(statsGeneralList, rows);
}

function openStatsPanel() {
    // quita el foco del input del juego, para que Enter no dispare el boton de abajo
    if (document.activeElement) document.activeElement.blur();
    renderStatsGeneral();
    showStatsGeneral();
    statsPanel.classList.remove("hidden");
    syncDialoguePause();
}

function closeStatsPanel() {
    statsPanel.classList.add("hidden");
    syncDialoguePause();
}

// igual que en Ajustes: los clicks de aqui no deben llegar al listener global de events.js
statsButton.onclick = (clickEvent) => {
    clickEvent.stopPropagation();
    openStatsPanel();
};
statsPanel.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
statsCloseButton.onclick = closeStatsPanel;


// ---- Pantallas de detalle por juego ----
const statsGeneralView = document.getElementById("stats-general");
const statsDetailView = document.getElementById("stats-detail");
const statsDetailTitle = document.getElementById("stats-detail-title");
const statsDetailSections = document.getElementById("stats-detail-sections");
const statsDetailButtons = document.getElementById("stats-detail-buttons");
const statsBackButton = document.getElementById("stats-back-button");

// porcentaje redondeado, o un guion si todavia no hay datos
function formatPercent(part, total) {
    return total > 0 ? `${Math.round(part / total * 100)}%` : "—";
}

// promedio con un decimal como maximo, o un guion si no hay datos
function formatAverage(total, count) {
    return count > 0 ? Math.round(total / count * 10) / 10 : "—";
}

// un valor que puede ser null (todavia sin dato): lo muestra tal cual o un guion
function formatOrDash(value) {
    return value === null ? "—" : value;
}

// un valor con su unidad en singular o plural según el idioma ("1 vida", "6 lives"), o un guion si no hay dato.
// "key" es la base de las claves _one/_other, igual que en tp()
function formatUnits(value, key) {
    if (value === null) return "—";
    return tp(key, value);
}

// llena un contenedor con filas "etiqueta ... valor" (todo como texto plano)
function fillStatRows(container, rows) {
    container.innerHTML = "";
    rows.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "flex justify-between gap-4";

        const labelSpan = document.createElement("span");
        labelSpan.className = "opacity-70";
        labelSpan.textContent = label;

        const valueSpan = document.createElement("span");
        valueSpan.className = "text-right";
        valueSpan.textContent = value;

        row.append(labelSpan, valueSpan);
        container.appendChild(row);
    });
}

// Cada juego devuelve su lista de cajas: { title, rows: [[etiqueta, valor], ...] }
// Las claves coinciden con stats.games y con data-game de los botones.
const statsDetailBuilders = {
    number: () => {
        const n = stats.games.number;
        const modeRows = (mode) => [
            [t("stat_games"), mode.plays],
            [t("stat_best_game"), formatUnits(mode.bestAttempts, "unit_attempts")],
            [t("stat_avg_attempts"), formatAverage(mode.totalAttempts, mode.plays)]
        ];

        return [
            {
                title: t("stat_general"), rows: [
                    [t("stat_games"), n.plays],
                    [t("stat_best_game"), formatUnits(n.bestAttempts, "unit_attempts")],
                    [t("stat_total_attempts"), n.totalAttempts],
                    [t("stat_avg_attempts"), formatAverage(n.totalAttempts, n.plays)]
                ]
            },
            { title: t("mode_casual"), rows: modeRows(n.modes.casual) },
            { title: t("mode_desafio"), rows: [...modeRows(n.modes.desafio), [t("stat_escapes"), n.modes.desafio.escapes]] }
        ];
    },

    countWithMe: () => {
        const c = stats.games.countWithMe;
        const casual = c.modes.casual;
        const infinito = c.modes.infinito;

        return [
            {
                title: t("stat_general"), rows: [
                    [t("stat_games"), c.plays],
                    [t("stat_total_answers"), c.totalAnswers],
                    [t("stat_correct"), c.correctAnswers],
                    [t("stat_accuracy"), formatPercent(c.correctAnswers, c.totalAnswers)]
                ]
            },
            {
                title: t("mode_casual"), rows: [
                    [t("stat_games"), casual.plays],
                    [t("stat_best_score"), c.bestTen === null ? "—" : `${c.bestTen}/10`],
                    [t("stat_best_streak"), formatOrDash(casual.bestStreak)],
                    [t("stat_accuracy"), formatPercent(casual.correctAnswers, casual.totalAnswers)]
                ]
            },
            {
                title: t("mode_infinito"), rows: [
                    [t("stat_games"), infinito.plays],
                    [t("stat_best_streak"), formatOrDash(c.bestInfinite)],
                    [t("stat_accuracy"), formatPercent(infinito.correctAnswers, infinito.totalAnswers)]
                ]
            }
        ];
    },

    hangman: () => {
        const h = stats.games.hangman;
        const experto = h.modes.experto;
        // el total (h) y cada modo tienen los mismos campos, asi que comparten esta funcion
        const modeRows = (mode) => [
            [t("stat_games"), mode.plays],
            [t("stat_wins"), mode.wins],
            [t("stat_losses"), mode.losses],
            [t("stat_win_rate"), formatPercent(mode.wins, mode.plays)],
            [t("stat_best_game"), formatUnits(mode.bestMargin, "unit_lives")]
        ];

        return [
            { title: t("stat_general"), rows: modeRows(h) },
            { title: t("mode_casual"), rows: modeRows(h.modes.casual) },
            { title: t("mode_desafio"), rows: modeRows(h.modes.desafio) },
            {
                title: t("mode_experto"), rows: [
                    ...modeRows(experto),
                    [t("stat_hints_used"), experto.hintsUsed],
                    [t("stat_revives"), experto.revives]
                ]
            }
        ];
    }
};

// muestra la pantalla de detalle del juego indicado (arma una caja por cada seccion)
function showStatsDetail(gameKey) {
    statsDetailTitle.textContent = t(gameNameKeys[gameKey]);
    statsDetailSections.innerHTML = "";

    statsDetailBuilders[gameKey]().forEach(section => {
        const box = document.createElement("div");
        box.className = "panel-box-soft flex flex-col gap-2 w-full md:w-52";

        const title = document.createElement("h4");
        title.className = "text-label-technical font-label-technical uppercase text-primary-container";
        title.textContent = section.title;

        const list = document.createElement("div");
        list.className = "flex flex-col gap-1 text-body-md font-body-md";
        fillStatRows(list, section.rows);

        box.append(title, list);
        statsDetailSections.appendChild(box);
    });

    statsGeneralView.classList.add("hidden");
    statsDetailView.classList.remove("hidden");
}

// vuelve a la vista general
function showStatsGeneral() {
    statsDetailView.classList.add("hidden");
    statsGeneralView.classList.remove("hidden");
}

// delegacion de eventos, igual que en los menus de juego y de modo
statsDetailButtons.onclick = (clickEvent) => {
    const button = clickEvent.target.closest("button[data-game]");
    if (!button) return;
    showStatsDetail(button.dataset.game);
};
statsBackButton.onclick = showStatsGeneral;
