// Sistema de memoria persistente de Yoro (localStorage)

// Carga las estadisticas guardadas, o crea la estructura inicial si es la primera vez
function loadStats() {
    const stored = localStorage.getItem("yoro_stats");
    if (stored) return JSON.parse(stored);

    // primera vez con este sistema: migramos el contador de visitas viejo si existia
    const oldVisits = Number(localStorage.getItem("yoro_visits")) || 0;

    return {
        visits: oldVisits,
        games: {
            number: { plays: 0, wins: 0, bestAttempts: null },
            countWithMe: { plays: 0, bestTen: null, bestInfinite: null, totalAnswers: 0, correctAnswers: 0 }
        }
    };
}

// Guarda las estadisticas actuales
function saveStats(stats) {
    try {
        localStorage.setItem("yoro_stats", JSON.stringify(stats));
    } catch (error) {
        console.warn("No se pudo guardar el progreso de Yoro:", error);
    }
}