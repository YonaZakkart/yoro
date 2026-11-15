// Cuerpo de Yoro: animación continua (flotar, respirar, seguir el cursor o el dedo con la mirada,
// parpadear), poses de brazos y reacción al tocar la cabeza o el núcleo.
// El dibujo vive en index.html (SVG, viewBox 1190x1900): todas las medidas van en esas unidades.

const yoroStage = document.getElementById("yoro-avatar");
const yoroParts = {
    root: document.getElementById("yoro-root"),
    shadow: document.getElementById("yoro-shadow"),
    torso: document.getElementById("yoro-torso"),
    core: document.getElementById("yoro-core"),
    head: document.getElementById("yoro-head"),
    eyes: document.getElementById("yoro-eyes"),
    mouth: document.getElementById("yoro-mouth"),
    armR: document.getElementById("yoro-arm-r"),
    armL: document.getElementById("yoro-arm-l"),
    legR: document.getElementById("yoro-leg-r"),
    legL: document.getElementById("yoro-leg-l")
};
const yoroArmPoses = {
    right: yoroParts.armR.querySelector(".yoro-arm-pose"),
    left: yoroParts.armL.querySelector(".yoro-arm-pose")
};

// con "reducir movimiento" activado, todo se mueve a un cuarto de su amplitud
const YORO_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0.25 : 1;

const yoroState = {
    gazeX: 0, gazeY: 0,      // mirada actual (-1 a 1)
    targetX: 0, targetY: 0,  // hacia donde quiere mirar
    boopAt: -9,              // último toque en la cabeza (segundos)
    flashAt: -9,             // último toque en el núcleo (segundos)
    blinkAt: 1.5,            // próximo parpadeo
    blinkEnd: 0,             // fin del parpadeo en curso (0 = ojos abiertos)
    lastFrame: performance.now()
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// la mirada sigue al cursor o al dedo, relativa a la posición de Yoro en pantalla
function yoroLookAt(event) {
    const rect = yoroStage.getBoundingClientRect();
    if (!rect.width) return; // Yoro oculto (por ejemplo, tabla de resultados del Ahorcado)
    yoroState.targetX = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width * 1.1), -1, 1);
    yoroState.targetY = clamp((event.clientY - rect.top - rect.height * 0.3) / (rect.height * 0.7), -1, 1);
}
window.addEventListener("pointermove", yoroLookAt);
window.addEventListener("pointerdown", yoroLookAt);

// poses: 0 abajo, 1 medio, 2 arriba
function setYoroArms(right, left = right) {
    yoroArmPoses.right.dataset.pose = right;
    yoroArmPoses.left.dataset.pose = left;
}

// Gestos con los brazos. Saludar y celebrar son secuencias que mandan sobre los brazos mientras duran;
// el gesto de hablar es suelto y solo aparece si no hay una secuencia en curso.
const yoroGestures = { token: 0, sequence: false };
const yoroWait = ms => new Promise(resolve => setTimeout(resolve, ms));

// corre una secuencia; cada paso puede salir si otra secuencia empezó después (token distinto)
async function runYoroSequence(steps) {
    const token = ++yoroGestures.token;
    yoroGestures.sequence = true;
    const alive = () => token === yoroGestures.token;
    await steps(alive);
    if (!alive()) return;
    setYoroArms(0);
    yoroGestures.sequence = false;
}

function yoroWave() {
    return runYoroSequence(async alive => {
        for (let i = 0; i < 6; i++) {
            if (!alive()) return;
            setYoroArms(i % 2 ? 1 : 2, 0);
            await yoroWait(260);
        }
    });
}

// la animación del antiguo "piedra, papel o tijeras", sin letras
function yoroCelebrate() {
    return runYoroSequence(async alive => {
        setYoroArms(0);
        await yoroWait(300);
        for (let i = 0; i < 3; i++) {
            if (!alive()) return;
            setYoroArms(2);
            yoroBoop();
            await yoroWait(380);
            if (!alive()) return;
            setYoroArms(1);
            await yoroWait(380);
        }
        if (!alive()) return;
        setYoroArms(2);
        await yoroWait(900);
    });
}

const YORO_TALK_CHANCE = 0.3;
const yoroTalkPoses = [[1, 1], [2, 2], [1, 0], [2, 0], [0, 1], [0, 2]];

// al decir una línea, a veces sube uno o ambos brazos unos segundos y vuelve a bajarlos
function yoroTalkGesture() {
    if (yoroGestures.sequence || Math.random() >= YORO_TALK_CHANCE) return;
    const token = ++yoroGestures.token;
    const [right, left] = yoroTalkPoses[Math.floor(Math.random() * yoroTalkPoses.length)];
    setYoroArms(right, left);
    setTimeout(() => {
        if (token === yoroGestures.token) setYoroArms(0);
    }, 1500 + Math.random() * 1500);
}

// Expresiones: neutral, sleep, happy, surprised, sad (aburrido/molesto), angry, dizzy.
// Con duración (ms), al terminar pasa a "next" (por defecto vuelve a neutral).
const YORO_EXPRESSIONS = ["neutral", "sleep", "happy", "surprised", "sad", "angry", "dizzy"];
let yoroExpressionTimer = null;

function setYoroExpression(name, duration = 0, next = "neutral") {
    if (!YORO_EXPRESSIONS.includes(name)) return;
    clearTimeout(yoroExpressionTimer);
    yoroExpressionTimer = null;
    yoroStage.dataset.expression = name;
    if (duration > 0) {
        yoroExpressionTimer = setTimeout(() => setYoroExpression(next), duration);
    }
}

function getYoroExpression() {
    return yoroStage.dataset.expression;
}

function setYoroBlink(closed) {
    yoroParts.eyes.classList.toggle("yoro-blink", closed);
}

function yoroBoop() {
    const now = performance.now() / 1000;
    yoroState.boopAt = now;
    yoroState.blinkEnd = now + 0.14;
    setYoroBlink(true);
}

function yoroPulseCore() {
    yoroState.flashAt = performance.now() / 1000;
}

document.getElementById("yoro-hit-head").addEventListener("click", yoroBoop);
document.getElementById("yoro-hit-core").addEventListener("click", yoroPulseCore);

function yoroFrame(now) {
    requestAnimationFrame(yoroFrame);
    const s = yoroState;
    const t = now / 1000;
    const dt = Math.min(0.05, (now - s.lastFrame) / 1000);
    s.lastFrame = now;
    if (yoroStage.classList.contains("hidden")) return;

    const M = YORO_MOTION;
    const follow = 1 - Math.exp(-dt * 9);
    s.gazeX += (s.targetX - s.gazeX) * follow;
    s.gazeY += (s.targetY - s.gazeY) * follow;
    const gx = s.gazeX, gy = s.gazeY;

    // flotar y respirar
    const bob = Math.sin(t * 1.6) * 16 * M;
    const breath = Math.sin(t * 1.6 + 0.6);
    yoroParts.root.setAttribute("transform", `translate(0 ${bob})`);
    yoroParts.shadow.setAttribute("transform", `translate(594 1868) scale(${1 - bob / 16 * 0.06 * M} 1) translate(-594 -1868)`);
    yoroParts.torso.setAttribute("transform", `translate(0 1440) scale(1 ${1 + breath * 0.008 * M}) translate(0 -1440)`);

    // cabeza: sigue la mirada y rebota al tocarla
    const sinceBoop = t - s.boopAt;
    const squash = sinceBoop < 1.2 ? Math.exp(-6 * sinceBoop) * Math.sin(20 * sinceBoop) : 0;
    yoroParts.head.setAttribute("transform",
        `translate(${gx * 12} ${gy * 7 - breath * 3 * M - squash * 14}) ` +
        `rotate(${gx * 3.5 * M + squash * 1.5} 593 1020) ` +
        `translate(593 1020) scale(${1 + squash * 0.025} ${1 - squash * 0.04}) translate(-593 -1020)`);
    yoroParts.eyes.setAttribute("transform", `translate(${gx * 20} ${gy * 12})`);
    yoroParts.mouth.setAttribute("transform", `translate(${gx * 14} ${gy * 8})`);

    // núcleo: late suave y destella al tocarlo
    const sinceFlash = t - s.flashAt;
    const flash = sinceFlash < 0.8 ? Math.exp(-5 * sinceFlash) : 0;
    const pulse = Math.sin(t * 2.2);
    yoroParts.core.style.opacity = Math.min(1, 0.78 + 0.22 * pulse + flash);
    yoroParts.core.setAttribute("transform", `translate(594 1145) scale(${1 + 0.035 * pulse * M + flash * 0.25}) translate(-594 -1145)`);

    // parpadeo cada 2.5 a 6 segundos
    if (s.blinkEnd && t > s.blinkEnd) {
        s.blinkEnd = 0;
        setYoroBlink(false);
        s.blinkAt = t + 2.5 + Math.random() * 3.5;
    } else if (!s.blinkEnd && t > s.blinkAt) {
        s.blinkEnd = t + 0.13;
        setYoroBlink(true);
    }

    // balanceo de brazos y piernas (el brazo izquierdo está reflejado, por eso usa el mismo giro)
    const sway = Math.sin(t * 1.6 - 0.4) * 1.6 * M;
    yoroParts.armR.setAttribute("transform", `rotate(${sway} 885 1045)`);
    yoroParts.armL.setAttribute("transform", `rotate(${sway} 885 1045)`);
    yoroParts.legR.setAttribute("transform", `rotate(${-sway * 0.7} 730 1495)`);
    yoroParts.legL.setAttribute("transform", `rotate(${sway * 0.7} 452 1495)`);
}

requestAnimationFrame(yoroFrame);
