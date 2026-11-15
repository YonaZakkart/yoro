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