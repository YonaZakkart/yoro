function pickSecretNumber(max = 20) {
    return Math.floor(Math.random() * max) + 1;
}

// Mensajes de resultado v1.1
function getResultMessage(attempts) {
    if (attempts <= 5) return `¡Excelente! Lo lograste en ${attempts} intento(s)`;
    if (attempts <= 10) return `¡Bien! Te tomó ${attempts} intentos`;
    if (attempts <= 15) return `Regular... te tomó ${attempts} intentos.`;
    return `Pudo ser mejor. Te tomó ${attempts} intentos.`;
}