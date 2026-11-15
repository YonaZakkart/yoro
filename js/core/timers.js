// Temporizadores que se pueden pausar. Los usan los diálogos de Yoro (secuencias e idle) para
// detenerse mientras un panel a pantalla completa (Opciones, Estadísticas) está abierto,
// y seguir exactamente donde iban al cerrarlo.

const pausableTimers = new Set();
let timersPaused = false;

function startPausableTimer(timer) {
    timer.startedAt = Date.now();
    timer.id = setTimeout(timer.run, timer.remaining);
}

// igual que setTimeout, pero respeta la pausa; si se crea durante una pausa, espera a que termine
function setPausableTimeout(callback, delay) {
    const timer = { remaining: delay, startedAt: 0, id: null };
    timer.run = () => {
        pausableTimers.delete(timer);
        callback();
    };
    pausableTimers.add(timer);
    if (!timersPaused) startPausableTimer(timer);
    return timer;
}

function clearPausableTimeout(timer) {
    if (!timer) return;
    clearTimeout(timer.id);
    pausableTimers.delete(timer);
}

function pauseTimers() {
    if (timersPaused) return;
    timersPaused = true;
    pausableTimers.forEach(timer => {
        clearTimeout(timer.id);
        timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
    });
}

function resumeTimers() {
    if (!timersPaused) return;
    timersPaused = false;
    pausableTimers.forEach(startPausableTimer);
}

// pausa los diálogos si hay algún panel a pantalla completa (.screen-overlay) visible, y los reanuda si no
function syncDialoguePause() {
    const anyPanelOpen = document.querySelector(".screen-overlay:not(.hidden)") !== null;
    if (anyPanelOpen) pauseTimers(); else resumeTimers();
}
