function pickSecretNumber(max = 50) {
    return Math.floor(Math.random() * max) + 1;
}

// Mensajes de resultado v1.1
function getResultMessage(attempts) {
    if (attempts <= 5) return tp("res11_top", attempts);
    if (attempts <= 10) return t("res11_good", { attempts });
    if (attempts <= 15) return t("res11_ok", { attempts });
    return t("res11_poor", { attempts });
}
// Mensajes de resultado v1.2 modo Casual 
function getResultMessageCasual(attempts) {
    if (attempts < 6) return tp("resC_top", attempts);
    if (attempts < 12) return t("resC_good", { attempts });
    if (attempts < 18) return t("resC_ok", { attempts });
    if (attempts < 24) return t("resC_meh", { attempts });
    return t("resC_hard", { attempts });
}
// Mensajes de resultado v1.2 modo Desafio 
function getResultMessageDesafio(attempts) {
    if (attempts < 5) return tp("resD_top", attempts);
    if (attempts < 10) return t("resD_great", { attempts });
    if (attempts < 15) return t("resD_good", { attempts });
    if (attempts < 25) return t("resD_meh", { attempts });
    if (attempts < 40) return t("resD_hard", { attempts });
    return t("resD_toomuch", { attempts });
}

// Pistas del modo Casual (Evento 4): dirección (arriba/abajo) y cercanía (lejos/normal/cerca)
function getHintCasual(secretNumber, guess) {
    const distance = Math.abs(secretNumber - guess);
    const direction = guess < secretNumber ? "up" : "down";
    const closeness = distance > 10 ? "far" : distance < 3 ? "close" : "normal";

    return t(`hint_${direction}_${closeness}`);
}

// Modo Desafio (Evento 4) - reasigna el numero tras 5 fallos 
function handleDesafioFail(currentSecret, failStreak, max = 50, failLimit = 5) {
    const newFailStreak = failStreak + 1;

    if (newFailStreak >= failLimit) {
        return { secretNumber: pickSecretNumber(max), failStreak: 0, changed: true };
    }

    return { secretNumber: currentSecret, failStreak: newFailStreak, changed: false };
}

// ---- Partidas de Adivina el Número (Eventos 1, 2 y 4) ----

// Evento 1. Juego: Adivina el numero (1)
function startGuessingGame(event) {
    const secretNumber = pickSecretNumber(10);
    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_guess"
    });

    let attempts = 0;

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"));
            return;
        }
        const guess = Number(guessInput.value);
        attempts++;

        if (guess === secretNumber) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("number_win_v1");
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
            yoroCelebrate();
            stats.games.number.totalAttempts += attempts;
            if (stats.games.number.bestAttempts === null || attempts < stats.games.number.bestAttempts) {
                stats.games.number.bestAttempts = attempts;
            }
            saveStats(stats);

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    finishEvent(event);
                }, FADE_DURATION);
            }, 3200);
        } else {
            showQuickMessage(t("number_miss_v1", { attempts }));
        }
    };
}

//Evento 2. Juego: Adivina el numero 1.1
function startGuessingGame_1_1(event) {
    const secretNumber = pickSecretNumber(20);
    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_guess"
    });

    let attempts = 0;

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"));
            return;
        }
        const guess = Number(guessInput.value);
        attempts++;

        if (guess === secretNumber) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = getResultMessage(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
            yoroCelebrate();
            stats.games.number.totalAttempts += attempts;
            if (stats.games.number.bestAttempts === null || attempts < stats.games.number.bestAttempts) {
                stats.games.number.bestAttempts = attempts;
            }
            saveStats(stats);

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    finishEvent(event);
                }, FADE_DURATION);
            }, 3200);
        } else {
            showQuickMessage(guess < secretNumber ? t("hint_up_normal") : t("hint_down_normal"));
        }
    };
}

//Evento 4. Logica del juego, compartida entre ambos modos
function runGuessingGame_1_2(event, mode) {
    let secretNumber = pickSecretNumber(50);
    let failStreak = 0;
    let escapes = 0;

    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "number", placeholderKey: "number_placeholder", buttonKey: "btn_guess"
    });

    let attempts = 0;

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage(t("msg_write_number"));
            return;
        }
        const guess = Number(guessInput.value);
        attempts++;


        if (guess === secretNumber) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = mode === "casual"
                ? getResultMessageCasual(attempts)
                : getResultMessageDesafio(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
            yoroCelebrate();
            stats.games.number.totalAttempts += attempts;
            if (stats.games.number.bestAttempts === null || attempts < stats.games.number.bestAttempts) {
                stats.games.number.bestAttempts = attempts;
            }

            // "mode" vale "casual" o "desafio", igual que las claves de modes
            const modeStats = stats.games.number.modes[mode];
            modeStats.plays++;
            modeStats.totalAttempts += attempts;
            if (modeStats.bestAttempts === null || attempts < modeStats.bestAttempts) {
                modeStats.bestAttempts = attempts;
            }
            if (mode === "desafio") modeStats.escapes += escapes;
            saveStats(stats);

            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(() => {
                    gameUI.classList.add("hidden");
                    finishEvent(event);
                }, FADE_DURATION);
            }, 3200);
        } else {
            let hintText;
            if (mode === "casual") {
                hintText = getHintCasual(secretNumber, guess);
            } else {
                const result = handleDesafioFail(secretNumber, failStreak);
                secretNumber = result.secretNumber;
                failStreak = result.failStreak;
                if (result.changed) escapes++;

                const direction = guess < secretNumber ? "up" : "down";
                hintText = result.changed
                    ? t(`hint_changed_${direction}`)
                    : t(`hint_${direction}_normal`);
            }
            showQuickMessage(hintText);
        }
    };
}
