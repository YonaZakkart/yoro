// Sistema de memoria persistente de Yoro (localStorage)

// Carga las estadisticas guardadas, o crea la estructura inicial si es la primera vez
function loadStats() {
    const stored = localStorage.getItem("yoro_stats");
    const stats = stored ? JSON.parse(stored) : {
        visits: Number(localStorage.getItem("yoro_visits")) || 0,
        games: {
            number: { plays: 0, wins: 0, bestAttempts: null },
            countWithMe: { plays: 0, bestTen: null, bestInfinite: null, totalAnswers: 0, correctAnswers: 0 }
        }
    };

    if (!stats.games.hangman) {
        stats.games.hangman = { plays: 0, wins: 0, losses: 0, bestMargin: null };
    }

    return stats;
}

// Guarda las estadisticas actuales
function saveStats(stats) {
    try {
        localStorage.setItem("yoro_stats", JSON.stringify(stats));
    } catch (error) {
        console.warn("No se pudo guardar el progreso de Yoro:", error);
    }
}