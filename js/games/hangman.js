// Ahorcado (Eventos 7, 8 y 9): ayudantes de palabras y letras, y las partidas de cada version.
// Los bancos de palabras y los dibujos ASCII estan en js/games/hangman-data.js.

// elige una palabra al azar del banco según idioma actual
function pickSecretWord() {
    const lang = getCurrentLang();
    const pool = hangmanWords[lang];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

// quita tildes y diéresis de las vocales (á -> a, ü -> u) sin tocar la ñ, y pasa a minúsculas.
// Se usa para comparar: el jugador no necesita escribir la tilde para acertar la letra.
function normalizeHangmanText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0301\u0308]/g, "").normalize("NFC");
}

// true si la letra de la palabra secreta (con o sin tilde) ya fue adivinada
function isLetterGuessed(char, guessedLetters) {
    return guessedLetters.includes(normalizeHangmanText(char));
}

// devuelve un arreglo con las letras unicas de la palabra (sin repetir, sin tildes)
// ej: "banana" -> ["b", "a", "n"], "canción" -> ["c", "a", "n", "i", "o"]
function getUniqueLetters(word) {
    return [...new Set(normalizeHangmanText(word).split(""))];
}

// cuenta cuantas veces aparece una letra dentro de la palabra secreta (ignorando tildes)
function countLetterOccurrences(word, letter) {
    return normalizeHangmanText(word).split("").filter(char => char === letter).length;
}

// compara si la palabra ingresada coincide con la palabra secreta (ignorando tildes)
function isWordMatch(secretWord, guess) {
    return normalizeHangmanText(secretWord) === normalizeHangmanText(guess.trim());
}

// elige una palabra al azar del banco exclusivo de Experto según idioma
function pickSecretWordExperto() {
    const lang = getCurrentLang();
    const pool = hangmanWordsExperto[lang];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

// Regex dinámico según idioma: ES acepta tildes y ñ, EN solo a-z
function getLetterRegex() {
    const lang = getCurrentLang();
    return lang === "en" ? /^[a-z]+$/i : /^[a-záéíóúüñ]+$/i;
}

// Sistema de recompensa por "visitar GitHub" (Ahorcado Experto): un solo listener global,
// en vez de uno nuevo por partida, evitando que se acumulen al repetir el juego.
let pendingHangmanReward = null;

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && pendingHangmanReward) {
        const reward = pendingHangmanReward;
        pendingHangmanReward = null;
        reward.onReturn();
    }
});

// Mensaje de "la letra aparece N veces" o "no aparece", compartido por todas las versiones del Ahorcado
function getLetterMessage(letter, count) {
    return count > 0
        ? tp("hangman_letter_found", count, { letter })
        : t("hangman_letter_missing", { letter });
}

// Botones "Letras usadas" / "Palabras usadas" y su modal, compartidos por todas las versiones del Ahorcado.
// El modal reemplaza al dibujo ASCII dentro de la misma caja mientras esta abierto.
// Se reciben funciones (y no los arreglos) porque cada juego puede reemplazar su arreglo de letras.
function setupHangmanUsedModal(getLetters, getWords) {
    const figure = document.getElementById("hangman-figure");
    const usedButtons = document.getElementById("hangman-used-buttons");
    const modal = document.getElementById("hangman-used-modal");
    const modalContent = document.getElementById("hangman-used-modal-content");

    function open(isLetters) {
        figure.classList.add("hidden");
        usedButtons.classList.add("hidden");

        const items = isLetters ? getLetters() : getWords();
        const label = t(isLetters ? "hangman_used_letters" : "hangman_used_words");
        modalContent.textContent = items.length > 0
            ? t("hangman_used_list", { label, items: items.join(", ") })
            : t("hangman_used_empty", { label });

        modal.classList.remove("hidden");
    }

    // cierra el modal; el dibujo solo vuelve si tiene contenido (la version base no tiene)
    function close() {
        modal.classList.add("hidden");
        figure.classList.toggle("hidden", figure.textContent === "");
        usedButtons.classList.remove("hidden");
    }

    document.getElementById("hangman-letters-button").onclick = () => open(true);
    document.getElementById("hangman-words-button").onclick = () => open(false);
    document.getElementById("hangman-used-close-button").onclick = close;
    close();
}

// Evento 7. Juego: Ahorcado (version base) - letra por letra o palabra completa, sin limite de intentos
function startHangmanGame(event) {
    const secretWord = pickSecretWord();

    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "text", placeholderKey: "hangman_placeholder", buttonKey: "btn_guess"
    });
    const hangmanStatus = document.getElementById("hangman-status");
    const hangmanHint = document.getElementById("hangman-hint");
    const hangmanProgress = document.getElementById("hangman-progress");

    let guessedLetters = [];
    let guessedWords = [];

    // la version base no tiene vidas ni dibujo: solo el largo de la palabra
    hangmanHint.textContent = t("hangman_hint_base", { letters: secretWord.length });
    document.getElementById("hangman-figure").textContent = "";
    updateProgress();
    setupHangmanUsedModal(() => guessedLetters, () => guessedWords);
    hangmanStatus.classList.remove("hidden");

    function updateProgress() {
        hangmanProgress.textContent = secretWord.split("").map(char =>
            isLetterGuessed(char, guessedLetters) ? char : "_"
        ).join(" ");
    }

    function isWordFullyRevealed() {
        return secretWord.split("").every(char => isLetterGuessed(char, guessedLetters));
    }

    function finishGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
        yoroCelebrate(); // la version base solo termina al adivinar la palabra

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                gameUI.classList.add("hidden");
                hangmanStatus.classList.add("hidden");
                guessInput.disabled = false;
                guessButton.disabled = false;
                finishEvent(event);
            }, FADE_DURATION);
        }, 3200);
    }

    guessButton.onclick = () => {
        const raw = normalizeHangmanText(guessInput.value.trim());
        guessInput.value = "";

        if (raw.length === 0) {
            showQuickMessage(t("msg_write_letter_or_word"));
            return;
        }
        if (!getLetterRegex().test(raw)) {
            showQuickMessage(t("msg_letters_only"));
            return;
        }

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                showQuickMessage(t("hangman_letter_repeat_v1", { letter }));
                return;
            }

            guessedLetters.push(letter);
            const count = countLetterOccurrences(secretWord, letter);
            const message = getLetterMessage(letter, count);

            if (count > 0) updateProgress();

            if (isWordFullyRevealed()) {
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = t("hangman_completed", { message });
                finishGame();
                return;
            }
            showQuickMessage(message);
            return;
        }

        if (raw.length === 2) {
            showQuickMessage(t("msg_one_letter_or_word"));
            return;
        }

        if (guessedWords.includes(raw)) {
            showQuickMessage(t("hangman_word_repeat_v1", { word: raw }));
            return;
        }

        guessedWords.push(raw);
        if (isWordMatch(secretWord, raw)) {
            guessedLetters = getUniqueLetters(secretWord);
            updateProgress();
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("hangman_word_right");
            finishGame();
            return;
        }
        showQuickMessage(t("hangman_word_wrong"));
    };
}

// Muestra la tabla de resultados del Ahorcado en lugar de Yoro, hasta que el jugador de click en "Aceptar"
function showHangmanResults(won, figureText, lines, onComplete) {
    const resultsUI = document.getElementById("hangman-results");
    const acceptButton = document.getElementById("hangman-results-accept");
    const yoroAvatar = document.getElementById("yoro-avatar");

    const title = won ? t("hangman_win_title") : t("hangman_lose_title");
    const titleColor = won ? "text-primary-container" : "text-error";
    const subtitle = won ? t("hangman_win_subtitle") : t("hangman_lose_subtitle");

    // armado con textContent (no innerHTML): el dibujo y las lineas llevan texto de la partida
    function createText(tag, className, text) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    }

    const linesBox = document.createElement("div");
    linesBox.className = "flex flex-col gap-1";
    linesBox.append(...lines.map(line => createText("p", "", line)));

    resultsUI.replaceChildren(
        createText("pre", "text-label-code font-label-code leading-tight", figureText),
        createText("h3", `text-headline-md font-headline-md ${titleColor}`, title),
        createText("p", "text-body-md font-body-md opacity-70 mb-2", subtitle),
        linesBox
    );
    resultsUI.classList.remove("hidden");
    acceptButton.classList.remove("hidden");

    yoroAvatar.classList.add("hidden");
    dialogueContainer.style.opacity = 0;
    dialogueContainer.classList.add("hidden");

    acceptButton.onclick = () => {
        resultsUI.classList.add("hidden");
        acceptButton.classList.add("hidden");

        yoroAvatar.classList.remove("hidden");
        dialogueContainer.classList.remove("hidden");

        onComplete();
    };
}

// Evento 8/9. Ahorcado 1.1/1.2: logica compartida entre modo Casual, Desafio y Experto
function runHangmanGame_1_1(event, mode) {
    const secretWord = mode === "experto" ? pickSecretWordExperto() : pickSecretWord();
    const stages = mode === "casual" ? hangmanStagesCasual : mode === "desafio" ? hangmanStagesDesafio : hangmanStagesExperto;
    const maxWrongGuesses = stages.length - 1;

    const { gameUI, guessInput, guessButton } = setupGameInput({
        type: "text", placeholderKey: "hangman_placeholder", buttonKey: "btn_guess"
    });
    const hangmanStatus = document.getElementById("hangman-status");
    const hangmanHint = document.getElementById("hangman-hint");
    const hangmanProgress = document.getElementById("hangman-progress");
    const hangmanFigure = document.getElementById("hangman-figure");
    const hintButton = document.getElementById("hint-button");
    const hintCooldownText = document.getElementById("hint-cooldown");
    const hintConfirmUI = document.getElementById("hint-confirm-ui");
    const hintCancelButton = document.getElementById("hint-cancel-button");
    const hintAcceptButton = document.getElementById("hint-accept-button");
    const hangmanGithubPrompt = document.getElementById("hangman-github-prompt");
    const hangmanGithubButton = document.getElementById("hangman-github-button");
    const hangmanLoseMenu = document.getElementById("hangman-lose-menu");
    const hangmanLoseMessage = document.getElementById("hangman-lose-message");
    const hangmanLoseCancel = document.getElementById("hangman-lose-cancel");
    const hangmanLoseAccept = document.getElementById("hangman-lose-accept");
    const hangmanRewardModal = document.getElementById("hangman-reward-modal");
    const hangmanRewardAccept = document.getElementById("hangman-reward-accept");

    let guessedLetters = [];
    let guessedWords = [];
    let letterAttemptsUsed = 0;
    let wordAttemptsUsed = 0;
    let wordGuessUsed = false;
    let wrongGuesses = 0;

    const hintsEnabled = mode === "experto";
    const hintCooldownLimit = 3;
    const hintCost = 2;
    let letterFailsSinceHint = 0;
    let hintsUsedCount = 0;
    let revivesCount = 0;
    let hasRevivedOnce = false;

    updateHint();
    updateProgress();
    updateFigure();
    setupHangmanUsedModal(() => guessedLetters, () => guessedWords);
    hangmanStatus.classList.remove("hidden");

    if (hintsEnabled) {
        hintButton.classList.remove("hidden");
        hintCooldownText.classList.remove("hidden");
        updateHintButton();
    } else {
        hintButton.classList.add("hidden");
        hintCooldownText.classList.add("hidden");
    }
    updateGithubPrompt();

    function attemptsLeft() {
        return maxWrongGuesses - wrongGuesses;
    }

    function updateProgress() {
        hangmanProgress.textContent = secretWord.split("").map(char =>
            isLetterGuessed(char, guessedLetters) ? char : "_"
        ).join(" ");
    }

    function updateHint() {
        hangmanHint.textContent = tp("hangman_hint_lives", attemptsLeft(), { letters: secretWord.length });
    }

    function updateFigure() {
        const stageIndex = Math.min(wrongGuesses, stages.length - 1);
        hangmanFigure.textContent = stages[stageIndex];
    }

    function updateHintButton() {
        if (!hintsEnabled) return;
        const remaining = hintCooldownLimit - letterFailsSinceHint;

        if (remaining <= 0) {
            hintButton.disabled = false;
            hintButton.classList.add("hint-ready");
            hintCooldownText.textContent = t("hint_available");
        } else {
            hintButton.disabled = true;
            hintButton.classList.remove("hint-ready");
            hintCooldownText.textContent = t("hint_cooldown", { remaining });
        }
    }

    function updateGithubPrompt() {
        if (mode !== "experto") return;
        if (hasRevivedOnce && attemptsLeft() === 1) {
            hangmanGithubPrompt.classList.remove("hidden");
        } else {
            hangmanGithubPrompt.classList.add("hidden");
        }
    }

    // Oculta los elementos de juego (input, botones, estado de letras, dibujo ASCII)
    // para que un modal (confirmar pista, menu de revivir, modal de recompensa) ocupe su lugar
    function hideGameplayUI() {
        gameUI.classList.add("hidden");
        hangmanStatus.classList.add("hidden");
    }

    // Vuelve a mostrar los elementos de juego al cerrar un modal
    function showGameplayUI() {
        gameUI.classList.remove("hidden");
        hangmanStatus.classList.remove("hidden");
    }

    function useHint() {
        const unrevealed = getUniqueLetters(secretWord).filter(letter => !guessedLetters.includes(letter));
        if (unrevealed.length === 0) return;

        const revealedLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        guessedLetters.push(revealedLetter);
        wrongGuesses = Math.min(wrongGuesses + hintCost, maxWrongGuesses);
        letterFailsSinceHint = 0;
        hintsUsedCount++;

        updateProgress();
        updateHint();
        updateFigure();
        updateHintButton();
        updateGithubPrompt();

        dialogueContainer.style.opacity = 1;
        let message = t("hangman_hint_used", { letter: revealedLetter });

        if (isWordFullyRevealed()) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("hangman_completed", { message });
            endGame(true);
            return;
        }
        if (wrongGuesses >= maxWrongGuesses) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("hangman_hangman_done", { message });
            handleDefeat();
            return;
        }

        showQuickMessage(message);
    }

    function isWordFullyRevealed() {
        return secretWord.split("").every(char => isLetterGuessed(char, guessedLetters));
    }

    function formatAttemptCount(count) {
        return count === 0 ? t("hangman_none") : count;
    }

    function applyRevive() {
        revivesCount++;
        wrongGuesses = Math.max(0, wrongGuesses - 3);
        updateProgress();
        updateHint();
        updateFigure();
        updateHintButton();
        updateGithubPrompt();
        guessInput.disabled = false;
        guessButton.disabled = false;
    }

    function showLoseMenu() {
        hideGameplayUI();
        const messageData = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        hangmanLoseMessage.textContent = t(messageData.textKey);
        hangmanLoseCancel.textContent = t(messageData.cancelKey);
        hangmanLoseAccept.textContent = t(messageData.acceptKey);
        hangmanLoseMenu.classList.remove("hidden");

        hangmanLoseCancel.onclick = () => {
            hangmanLoseMenu.classList.add("hidden");
            showGameplayUI();
            endGame(false);
        };

        hangmanLoseAccept.onclick = () => {
            hangmanLoseMenu.classList.add("hidden");
            pendingHangmanReward = {
                onReturn: () => {
                    hangmanRewardModal.classList.remove("hidden");
                }
            };
            window.open(messageData.url, "_blank", "noopener");
        };
    }

    function handleDefeat() {
        if (mode !== "experto" || hasRevivedOnce) {
            endGame(false);
            return;
        }
        guessInput.disabled = true;
        guessButton.disabled = true;
        showLoseMenu();
    }

    function endGame(won) {
        guessInput.disabled = true;
        guessButton.disabled = true;
        gameUI.classList.add("hidden");
        hangmanStatus.classList.add("hidden");

        const margin = attemptsLeft();
        const modeStats = stats.games.hangman.modes[mode];

        stats.games.hangman.plays++;
        modeStats.plays++;
        if (won) {
            stats.games.hangman.wins++;
            modeStats.wins++;
            if (stats.games.hangman.bestMargin === null || margin > stats.games.hangman.bestMargin) {
                stats.games.hangman.bestMargin = margin;
            }
            if (modeStats.bestMargin === null || margin > modeStats.bestMargin) {
                modeStats.bestMargin = margin;
            }
        } else {
            stats.games.hangman.losses++;
            modeStats.losses++;
        }
        if (mode === "experto") {
            modeStats.hintsUsed += hintsUsedCount;
            modeStats.revives += revivesCount;
        }
        saveStats(stats);

        const finalFigureText = hangmanFigure.textContent;

        const resultLines = [
            t("hangman_res_mode", { mode: t("mode_" + mode) }),
            won
                ? t("hangman_res_found", { word: secretWord })
                : t("hangman_res_missed", { word: secretWord }),
            !won ? t("hangman_res_progress", { progress: hangmanProgress.textContent }) : null,
            t("hangman_res_letter_attempts", { count: letterAttemptsUsed }),
            t("hangman_res_word_attempts", { count: formatAttemptCount(wordAttemptsUsed) }),
            hintsEnabled ? t("hangman_res_hints", { count: hintsUsedCount }) : null,
            t("hangman_res_lives", { count: attemptsLeft() })
        ].filter(line => line !== null);

        showHangmanResults(won, finalFigureText, resultLines, () => {
            hintButton.classList.add("hidden");
            hintCooldownText.classList.add("hidden");
            hangmanGithubPrompt.classList.add("hidden");
            hangmanLoseMenu.classList.add("hidden");
            hangmanRewardModal.classList.add("hidden");
            guessInput.disabled = false;
            guessButton.disabled = false;
            if (won) yoroCelebrate(); // Yoro estaba oculto tras la tabla: celebra al volver
            finishEvent(event);
        });
    }

    hintButton.onclick = () => {
        if (hintButton.disabled) return;
        hideGameplayUI();
        hintConfirmUI.classList.remove("hidden");
    };

    hintCancelButton.onclick = () => {
        hintConfirmUI.classList.add("hidden");
        showGameplayUI();
    };

    hintAcceptButton.onclick = () => {
        hintConfirmUI.classList.add("hidden");
        showGameplayUI();
        useHint();
    };

    hangmanGithubButton.onclick = () => {
        pendingHangmanReward = {
            onReturn: () => {
                applyRevive();
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = t("hangman_thanks_lives");
                setTimeout(() => {
                    dialogueContainer.style.opacity = 0;
                }, 2500);
            }
        };
        window.open("https://github.com/YonaZakkart/yoro", "_blank", "noopener");
    };

    hangmanRewardAccept.onclick = () => {
        hangmanRewardModal.classList.add("hidden");
        showGameplayUI();
        hasRevivedOnce = true;
        applyRevive();
    };

    guessButton.onclick = () => {
        const raw = normalizeHangmanText(guessInput.value.trim());
        guessInput.value = "";

        if (raw.length === 0) {
            showQuickMessage(t("msg_write_letter_or_word"));
            return;
        }
        if (!getLetterRegex().test(raw)) {
            showQuickMessage(t("msg_letters_only"));
            return;
        }

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                showQuickMessage(t("hangman_letter_repeat", { letter }));
                return;
            }

            guessedLetters.push(letter);
            letterAttemptsUsed++;

            const count = countLetterOccurrences(secretWord, letter);
            const message = getLetterMessage(letter, count);

            if (count === 0) {
                wrongGuesses++;
                letterFailsSinceHint++;
            }
            updateProgress();
            updateHint();
            updateFigure();
            updateHintButton();
            updateGithubPrompt();

            if (isWordFullyRevealed()) {
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = t("hangman_completed", { message });
                endGame(true);
                return;
            }
            if (wrongGuesses >= maxWrongGuesses) {
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = t("hangman_hangman_done", { message });
                handleDefeat();
                return;
            }
            showQuickMessage(message);
            return;
        }

        if (raw.length === 2) {
            showQuickMessage(t("msg_one_letter_or_word"));
            return;
        }

        if (mode === "desafio" || mode === "experto") {
            if (wordGuessUsed) return;
            wordGuessUsed = true;
            wordAttemptsUsed++;
            guessedWords.push(raw);

            dialogueContainer.style.opacity = 1;
            if (isWordMatch(secretWord, raw)) {
                guessedLetters = getUniqueLetters(secretWord);
                updateProgress();
                dialogueParagraph.textContent = t("hangman_word_right");
                endGame(true);
            } else {
                wrongGuesses = maxWrongGuesses;
                updateFigure();
                updateGithubPrompt();
                dialogueParagraph.textContent = t("hangman_word_wrong_single");
                handleDefeat();
            }
            return;
        }

        // mode === "casual": la palabra completa se puede intentar varias veces
        if (guessedWords.includes(raw)) {
            showQuickMessage(t("hangman_word_repeat", { word: raw }));
            return;
        }

        guessedWords.push(raw);
        wordAttemptsUsed++;

        if (isWordMatch(secretWord, raw)) {
            guessedLetters = getUniqueLetters(secretWord);
            updateProgress();
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("hangman_word_right");
            endGame(true);
            return;
        }

        wrongGuesses++;
        updateHint();
        updateFigure();
        updateGithubPrompt();

        if (wrongGuesses >= maxWrongGuesses) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = t("hangman_word_wrong_final");
            handleDefeat();
            return;
        }
        showQuickMessage(t("hangman_word_wrong"));
    };
}
