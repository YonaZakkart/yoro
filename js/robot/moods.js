// Ánimo de Yoro: decide cuándo cambia de expresión. Se duerme si nadie le hace caso, reacciona a los
// toques seguidos en cabeza y núcleo, a los errores de escritura, a saltarse diálogos y a que muevan
// el cursor como loco. Las caras y los brazos viven en js/robot/yoro.js.

const MOOD = {
    sleepDelay: 15000,       // sin nada que hacer, se duerme a los 15 s
    resleepDelay: 20000,     // tras despertarlo, se vuelve a dormir a los 20 s
    murmurDelay: 15000,      // dormido 15 s seguidos, murmura algo
    tapGap: 650,             // toques separados por menos de esto cuentan como "seguidos"
    talkHappyChance: 0.45,   // al decir una línea, a veces se pone feliz
    durations: { happy: 3000, surprised: 2500, sad: 3500, dizzy: 4000, angry: 4500 }
};

// las expresiones fuertes no se pisan con una más suave mientras duran
const MOOD_RANK = { neutral: 0, happy: 1, surprised: 2, sad: 3, dizzy: 3, angry: 4, sleep: 5 };

const yoroMood = {
    mode: "busy",            // busy (diálogo o juego), idle (tras un evento), menu (esperando una elección)
    sleeping: false,
    intro: null,             // despertar del Evento 1 en curso: función que lo termina
    sleepTimer: null,
    murmurTimer: null,
    currentSleepDelay: MOOD.sleepDelay,
    taps: { head: 0, core: 0 },
    tapTimers: { head: null, core: null },
    inputErrors: 0,
    inputErrorThisClick: false,
    skips: 0
};

function feelYoro(name, duration = MOOD.durations[name], next) {
    if (yoroMood.sleeping) return;
    const current = getYoroExpression();
    if (current !== "neutral" && MOOD_RANK[name] < MOOD_RANK[current]) return;
    setYoroExpression(name, duration, next);
}

// --- Dormir y despertar ---

function clearSleepTimers() {
    clearPausableTimeout(yoroMood.sleepTimer);
    clearPausableTimeout(yoroMood.murmurTimer);
    yoroMood.sleepTimer = null;
    yoroMood.murmurTimer = null;
}

function scheduleYoroSleep(delay) {
    clearPausableTimeout(yoroMood.sleepTimer);
    yoroMood.currentSleepDelay = delay;
    yoroMood.sleepTimer = setPausableTimeout(fallAsleep, delay);
}

function fallAsleep() {
    yoroMood.sleepTimer = null;
    yoroMood.sleeping = true;
    setYoroArms(0);
    setYoroExpression("sleep");
    yoroMood.murmurTimer = setPausableTimeout(() => {
        yoroMood.murmurTimer = null;
        if (yoroMood.sleeping) showMurmur();
    }, MOOD.murmurDelay);
}

// tocarlo mientras duerme lo despierta mareado, molesto o enojado (40/40/20)
function wakeYoroByTouch() {
    yoroMood.sleeping = false;
    clearSleepTimers();
    hideIdleDialogue();
    const roll = Math.random();
    const reaction = roll < 0.4 ? "dizzy" : roll < 0.8 ? "sad" : "angry";
    setYoroExpression(reaction, MOOD.durations[reaction]);
    if (yoroMood.mode !== "busy") scheduleYoroSleep(MOOD.resleepDelay);
}

// Yoro queda libre: "idle" se duerme a los 15 s pase lo que pase; "menu" espera 15 s sin interacción
function startYoroIdle(mode = "idle") {
    yoroMood.mode = mode;
    if (!yoroMood.sleeping) scheduleYoroSleep(MOOD.sleepDelay);
}

// empieza un diálogo o un juego: si dormía, se despierta sin reaccionar
function setYoroBusy() {
    yoroMood.mode = "busy";
    clearSleepTimers();
    if (yoroMood.sleeping) {
        yoroMood.sleeping = false;
        setYoroExpression("neutral");
    }
}

// primera visita: Yoro está dormido, se despierta (solo o al tocarlo), se sorprende y empieza a hablar
function startYoroWakeUpIntro(onAwake) {
    yoroMood.sleeping = true;
    setYoroExpression("sleep");
    const timer = setPausableTimeout(() => yoroMood.intro(), 2800);
    yoroMood.intro = () => {
        clearPausableTimeout(timer);
        yoroMood.intro = null;
        yoroMood.sleeping = false;
        setYoroExpression("surprised", 1600);
        setPausableTimeout(onAwake, 1600);
    };
}

// en un menú, cualquier toque o tecla reinicia la cuenta para dormirse
function noteYoroInteraction() {
    if (yoroMood.mode === "menu" && !yoroMood.sleeping && yoroMood.sleepTimer) {
        scheduleYoroSleep(yoroMood.currentSleepDelay);
    }
}
window.addEventListener("pointerdown", noteYoroInteraction, true);
window.addEventListener("keydown", noteYoroInteraction, true);

// --- Toques seguidos en cabeza y núcleo ---

// el resultado sale cuando termina la racha (pasa MOOD.tapGap sin otro toque)
const TAP_REACTIONS = {
    head: count => count > 10 ? "dizzy" : count >= 8 ? "sad" : count >= 3 ? "happy" : null,
    core: count => count >= 8 ? "angry" : count >= 5 ? "sad" : count >= 3 ? "happy" : null
};

function touchYoro(part) {
    if (yoroMood.intro) return yoroMood.intro();
    if (yoroMood.sleeping) return wakeYoroByTouch();

    yoroMood.taps[part]++;
    clearTimeout(yoroMood.tapTimers[part]);
    yoroMood.tapTimers[part] = setTimeout(() => {
        const reaction = TAP_REACTIONS[part](yoroMood.taps[part]);
        yoroMood.taps[part] = 0;
        if (!reaction) return;
        feelYoro(reaction);
        // solo cuando se pone feliz suelta un comentario, y solo si no está ocupado hablando o jugando
        if (reaction === "happy" && yoroMood.mode !== "busy") showIdleDialogue();
    }, MOOD.tapGap);
}

document.getElementById("yoro-hit-head").addEventListener("click", () => touchYoro("head"));
document.getElementById("yoro-hit-core").addEventListener("click", () => touchYoro("core"));

// --- Errores de escritura y diálogos saltados ---

// errores seguidos al escribir (campo vacío, números donde van letras...): 3 lo molestan, 8 lo enojan
function noteYoroInputError() {
    yoroMood.inputErrorThisClick = true;
    yoroMood.inputErrors++;
    if (yoroMood.inputErrors >= 8) feelYoro("angry");
    else if (yoroMood.inputErrors >= 3) feelYoro("sad");
}

// un envío válido corta la racha. El listener de captura corre antes del onclick del juego,
// y la microtarea después: si el onclick no avisó un error, el envío fue válido.
["guess-button", "name-button"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => {
        yoroMood.inputErrorThisClick = false;
        queueMicrotask(() => {
            if (!yoroMood.inputErrorThisClick) yoroMood.inputErrors = 0;
        });
    }, true);
});

// líneas de diálogo saltadas seguidas: 4-5 lo molestan, 6 o más lo enojan
function noteYoroDialogueSkipped() {
    yoroMood.skips++;
    if (yoroMood.skips >= 6) feelYoro("angry");
    else if (yoroMood.skips >= 4) feelYoro("sad");
}

function noteYoroDialogueRead() {
    yoroMood.skips = 0;
}

// --- Cursor agitado ---

// si el cursor recorre mucha distancia en poco tiempo, Yoro se marea de tanto seguirlo con la mirada
const SHAKE_WINDOW_MS = 1200;
const SHAKE_COOLDOWN_MS = 6000;
const shake = { points: [], lastX: null, lastY: null, cooldownUntil: 0 };

window.addEventListener("pointermove", event => {
    const now = performance.now();
    if (shake.lastX !== null) {
        shake.points.push({ at: now, distance: Math.hypot(event.clientX - shake.lastX, event.clientY - shake.lastY) });
    }
    shake.lastX = event.clientX;
    shake.lastY = event.clientY;
    while (shake.points.length && now - shake.points[0].at > SHAKE_WINDOW_MS) shake.points.shift();

    if (now < shake.cooldownUntil || yoroMood.sleeping || yoroMood.intro) return;
    const traveled = shake.points.reduce((sum, point) => sum + point.distance, 0);
    if (traveled > 2.5 * Math.max(window.innerWidth, window.innerHeight)) {
        shake.points = [];
        shake.cooldownUntil = now + SHAKE_COOLDOWN_MS;
        feelYoro("dizzy");
    }
});

// --- Momentos del juego y de la conversación ---

// al decir una línea, a veces se pone feliz (la expresión más común)
function yoroTalks() {
    if (Math.random() < MOOD.talkHappyChance) feelYoro("happy");
}

// buena jugada durante la partida
function yoroCheers() {
    feelYoro("happy", 2500);
}

// fin de partida: feliz; sorprendido solo con un gran resultado, y luego feliz
function yoroGameOver(amazed = false) {
    if (amazed) feelYoro("surprised", MOOD.durations.surprised, ["happy", MOOD.durations.happy]);
    else feelYoro("happy");
}
