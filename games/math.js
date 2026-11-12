// Genera un problema aleatorio de suma o resta. "max" controla el rango de los numeros.
function generateMathProblem(max = 20, allowNegative = false) {
    const isSum = Math.random() < 0.5;

    if (isSum) {
        const a = pickSecretNumber(max);
        const b = pickSecretNumber(max);
        return { text: `${a} + ${b}`, answer: a + b };
    } else {
        const minuendMin = Math.ceil(max / 2);
        const subtrahendMax = Math.round(max * 0.6);
        const a = Math.floor(Math.random() * (max - minuendMin + 1)) + minuendMin;
        // sin negativos, el sustraendo nunca puede pasar del minuendo
        const bLimit = allowNegative ? subtrahendMax : Math.min(subtrahendMax, a);
        const b = Math.floor(Math.random() * bLimit) + 1;
        return { text: `${a} - ${b}`, answer: a - b };
    }
}

// Evalua el resultado de una ronda de 5 ejercicios
function getMathResultMessage(hits, total) {
    const won = hits >= Math.ceil(total / 2);
    return { won, text: t(`resM_${hits}`) };
}

// Mensajes de resultado para el modo Casual de Cuenta Conmigo 1.1
function getMathResultMessage10(hits) {
    const total = 10;
    const won = hits >= Math.ceil(total / 2);

    let key;
    if (hits === 10) key = "resM10_perfect";
    else if (hits >= 8) key = "resM10_good";
    else if (hits >= 5) key = "resM10_ok";
    else if (hits >= 2) key = "resM10_practice";
    else key = "resM10_dislike";

    return { won, text: t(key) };
}