// Sistema de memoria persistente de Yoro (localStorage)

// Estructura inicial de las estadisticas (usada al empezar de cero y al reiniciar)
function createInitialStats() {
    return {
        visits: 0,
        daysVisited: 0,
        lastVisitDay: null,
        firstVisitDay: null,
        games: {
            number: {
                plays: 0, wins: 0, bestAttempts: null, totalAttempts: 0,
                modes: {
                    casual: { plays: 0, bestAttempts: null, totalAttempts: 0 },
                    desafio: { plays: 0, bestAttempts: null, totalAttempts: 0, escapes: 0 }
                }
            },
            countWithMe: {
                plays: 0, bestTen: null, bestInfinite: null, totalAnswers: 0, correctAnswers: 0,
                modes: {
                    casual: { plays: 0, bestStreak: null, totalAnswers: 0, correctAnswers: 0 },
                    infinito: { plays: 0, totalAnswers: 0, correctAnswers: 0 }
                }
            },
            hangman: {
                plays: 0, wins: 0, losses: 0, bestMargin: null,
                modes: {
                    casual: { plays: 0, wins: 0, losses: 0, bestMargin: null },
                    desafio: { plays: 0, wins: 0, losses: 0, bestMargin: null },
                    experto: { plays: 0, wins: 0, losses: 0, bestMargin: null, hintsUsed: 0, revives: 0 }
                }
            }
        }
    };
}

// Fecha local de hoy como texto, ej. "2026-10-14" (se usa para contar dias distintos de visita)
function getTodayKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

// Completa con valores por defecto los campos que falten en datos guardados con una version antigua,
// sin tocar los que ya existen
function fillMissing(target, defaults) {
    Object.keys(defaults).forEach(key => {
        const defaultValue = defaults[key];
        if (target[key] === undefined) {
            target[key] = defaultValue;
        } else if (defaultValue !== null && typeof defaultValue === "object") {
            fillMissing(target[key], defaultValue);
        }
    });
}

// Carga las estadisticas guardadas, o crea la estructura inicial si es la primera vez
function loadStats() {
    const stored = localStorage.getItem("yoro_stats");
    const stats = stored ? JSON.parse(stored) : createInitialStats();

    if (!stored) {
        stats.visits = Number(localStorage.getItem("yoro_visits")) || 0;
    }

    fillMissing(stats, createInitialStats());

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