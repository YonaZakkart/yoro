// Genera un problema aleatorio de suma o resta
function generateMathProblem() {
    const isSum = Math.random() < 0.5;

    if (isSum) {
        const a = pickSecretNumber(20); // 1-20
        const b = pickSecretNumber(20); // 1-20
        return { text: `${a} + ${b}`, answer: a + b };
    } else {
        const a = Math.floor(Math.random() * 11) + 10; // 10-20
        const b = Math.floor(Math.random() * 12) + 1;  // 1-12
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