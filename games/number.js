function pickSecretNumber(max = 50) {
    return Math.floor(Math.random() * max) + 1;
}

// Mensajes de resultado v1.1
function getResultMessage(attempts) {
    if (attempts <= 5) return `¡Excelente! Lo lograste en ${attempts} intento(s)`;
    if (attempts <= 10) return `¡Bien! Te tomó ${attempts} intentos`;
    if (attempts <= 15) return `Regular... te tomó ${attempts} intentos.`;
    return `Pudo ser mejor. Te tomó ${attempts} intentos.`;
}
// Mensajes de resultado v1.2 modo Casual 
function getResultMessageCasual(attempts) {
    if (attempts < 6) return `¡Excelente! Lo lograste en ${attempts} intento(s)`;
    if (attempts < 12) return `¡Muy bien! Te tomó ${attempts} intentos`;
    if (attempts < 18) return `Estuvo bien, te tomó ${attempts} intentos`;
    if (attempts < 24) return `No estuvo tan mal, te tomó ${attempts} intentos`;
    return `Fue difícil, ¿eh? Te tomó ${attempts} intentos`;
}
// Mensajes de resultado v1.2 modo Desafio 
function getResultMessageDesafio(attempts) {
    if (attempts < 5) return `¡Increíble! Lo lograste en solo ${attempts} intento(s)`;
    if (attempts < 10) return `¡Excelente! Te tomó ${attempts} intentos`;
    if (attempts < 15) return `Estuviste muy bien, te tomó ${attempts} intentos`;
    if (attempts < 25) return `No estuvo tan mal, te tomó ${attempts} intentos`;
    if (attempts < 40) return `Fue difícil, ¿eh? Te tomó ${attempts} intentos`;
    return `Creo que fue demasiado... te tomó ${attempts} intentos`;
}

// Pistas del modo Casual (Evento 4) 
function getHintCasual(secretNumber, guess) {
    const distance = Math.abs(secretNumber - guess);
    const isLower = guess < secretNumber;

    let hint = isLower ? "Más arriba" : "Más abajo";
    if (distance > 10) {
        hint = isLower ? "Mucho más arriba" : "Mucho más abajo";
    }

    return distance < 3 ? `${hint}, muy cerca...` : `${hint}...`;
}

// Modo Desafio (Evento 4) - reasigna el numero tras 5 fallos 
function handleDesafioFail(currentSecret, failStreak, max = 50, failLimit = 5) {
    const newFailStreak = failStreak + 1;

    if (newFailStreak >= failLimit) {
        return { secretNumber: pickSecretNumber(max), failStreak: 0, changed: true };
    }

    return { secretNumber: currentSecret, failStreak: newFailStreak, changed: false };
}