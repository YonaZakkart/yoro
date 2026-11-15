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

// ---- Partidas de Cuenta Conmigo (Eventos 5 y 6) ----

// Evento 5. Juego: Cuenta Conmigo (suma y resta)
function startMathGame(event) {
    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_answer"
    });

    const totalProblems = 5;
    let problemIndex = 0;
    let hits = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem(); // o con maxRange / (maxRange, true), según el modo
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
        guessButton.disabled = false;
    }
    function finishGame() {
        const result = getMathResultMessage(hits, totalProblems);
        dialogueParagraph.textContent = result.text;
        if (result.won) yoroCelebrate();
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
        saveStats(stats);

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                finishEvent(event);
            }, FADE_DURATION);
        }, 3200);
    }

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"), { restoreText: `${currentProblem.text} = ?` });
            return;
        }
        guessButton.disabled = true;
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;
        if (correct) hits++;
        problemIndex++;

        stats.games.countWithMe.totalAnswers++;
        if (correct) stats.games.countWithMe.correctAnswers++;
        saveStats(stats);

        showQuickMessage(correct ? t("math_correct") : t("math_wrong", { answer: currentProblem.answer }), { duration: 1500 });

        setTimeout(() => {
            if (problemIndex >= totalProblems) {
                finishGame();
            } else {
                showProblem();
            }
        }, 1500 + FADE_DURATION);
    }
    showProblem();
}

// Evento 6. Modo Casual: 10 preguntas, rango mayor
function runMathGameCasual(event) {
    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_answer"
    });

    const totalProblems = 10;
    const maxRange = 50;
    let problemIndex = 0;
    let hits = 0;
    let racha = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem(maxRange);
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
        guessButton.disabled = false;
    }

    function finishGame() {
        const result = getMathResultMessage10(hits);
        dialogueParagraph.textContent = result.text;
        if (result.won) yoroCelebrate();
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
        stats.games.countWithMe.modes.casual.plays++;
        if (stats.games.countWithMe.bestTen === null || hits > stats.games.countWithMe.bestTen) {
            stats.games.countWithMe.bestTen = hits;
        }
        saveStats(stats);

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                finishEvent(event);
            }, FADE_DURATION);
        }, 3200);
    }

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"), { restoreText: `${currentProblem.text} = ?` });
            return;
        }
        guessButton.disabled = true;
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;
        let feedbackText;

        if (correct) {
            hits++;
            racha++;
            feedbackText = t("math_correct_streak", { streak: racha });
        } else {
            racha = 0;
            feedbackText = t("math_wrong", { answer: currentProblem.answer });
        }

        const casualStats = stats.games.countWithMe.modes.casual;
        stats.games.countWithMe.totalAnswers++;
        casualStats.totalAnswers++;
        if (correct) {
            stats.games.countWithMe.correctAnswers++;
            casualStats.correctAnswers++;
        }
        if (casualStats.bestStreak === null || racha > casualStats.bestStreak) {
            casualStats.bestStreak = racha;
        }
        saveStats(stats);

        problemIndex++;
        showQuickMessage(feedbackText, { duration: 1500 });

        setTimeout(() => {
            if (problemIndex >= totalProblems) {
                finishGame();
            } else {
                showProblem();
            }
        }, 1500 + FADE_DURATION);
    };

    showProblem();
}



// Evento 6. Modo Infinito: sin limite de preguntas, termina al primer fallo
function runMathGameInfinito(event) {
    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_answer"
    });

    const maxRange = 50;
    let attempts = 0;
    let currentProblem = null;

    function showProblem() {
        currentProblem = generateMathProblem(maxRange, true);
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
        guessButton.disabled = false;
    }

    function finishGame() {
        const racha = attempts - 1;
        dialogueParagraph.textContent = t("math_infinite_end", {
            exercises: tp("math_exercises", attempts),
            hits: tp("math_hits", attempts - 1)
        });
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
        stats.games.countWithMe.modes.infinito.plays++;
        // el modo Infinito no se gana ni se pierde: Yoro celebra los récords nuevos
        if (stats.games.countWithMe.bestInfinite === null || racha > stats.games.countWithMe.bestInfinite) {
            stats.games.countWithMe.bestInfinite = racha;
            if (racha > 0) yoroCelebrate();
        }
        saveStats(stats);

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                finishEvent(event);
            }, FADE_DURATION);
        }, 4200);
    }

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"), { restoreText: `${currentProblem.text} = ?` });
            return;
        }
        guessButton.disabled = true;
        const answer = Number(guessInput.value);
        attempts++;
        stats.games.countWithMe.totalAnswers++;
        stats.games.countWithMe.modes.infinito.totalAnswers++;

        if (answer === currentProblem.answer) {
            stats.games.countWithMe.correctAnswers++;
            stats.games.countWithMe.modes.infinito.correctAnswers++;
            saveStats(stats);
            showQuickMessage(t("math_correct_chain", { count: attempts }), { duration: 1200 });
            setTimeout(showProblem, 1200 + FADE_DURATION);
        } else {
            saveStats(stats);
            clearTimeout(quickRestoreTimeout);
            finishGame();
        }
    };

    showProblem();
}
