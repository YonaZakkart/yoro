// Genera un problema aleatorio de suma o resta. "max" controla el rango de los numeros.
function generateMathProblem(max = 20) {
    const isSum = Math.random() < 0.5;

    if (isSum) {
        const a = pickSecretNumber(max);
        const b = pickSecretNumber(max);
        return { text: `${a} + ${b}`, answer: a + b };
    } else {
        const minuendMin = Math.ceil(max / 2);
        const subtrahendMax = Math.round(max * 0.6);
        const a = Math.floor(Math.random() * (max - minuendMin + 1)) + minuendMin;
        const b = Math.floor(Math.random() * subtrahendMax) + 1;
        return { text: `${a} - ${b}`, answer: a - b };
    }
}

// Evalua el resultado de una ronda 
function getMathResultMessage(hits, total) {
    const won = hits >= Math.ceil(total / 2);

    const messages = {
        5: "¡Excelente!",
        4: "Estuviste bien",
        3: "No estuvo mal",
        2: "Necesitas practicar más...",
        1: "Lejos de la meta...",
        0: "¿No te gustan las matemáticas?"
    };

    return { won, text: messages[hits] };
}

// Mensajes de resultado para el modo Casual de Cuenta Conmigo 1.1 
function getMathResultMessage10(hits) {
    const total = 10;
    const won = hits >= Math.ceil(total / 2);

    let text;
    if (hits === 10) text = "¡Excelente!";
    else if (hits >= 8) text = "Estuviste bien";
    else if (hits >= 5) text = "No estuvo mal";
    else if (hits >= 2) text = "Necesitas practicar más...";
    else text = "¿No te gustan las matemáticas?";

    return { won, text };
}