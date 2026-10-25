// carga estadisticas y registra la visita actual
const stats = loadStats();
stats.visits++;

// cuenta un dia nuevo solo si la ultima visita registrada fue en otra fecha
const today = getTodayKey();
if (stats.firstVisitDay === null) {
    stats.firstVisitDay = today;
}
if (stats.lastVisitDay !== today) {
    stats.daysVisited++;
    stats.lastVisitDay = today;
}

saveStats(stats);
console.log("Visitas:", stats.visits);

// permite confirmar con Enter en vez de solo hacer click
function enableEnterKey(inputElement, buttonElement) {
    inputElement.onkeydown = (event) => {
        if (event.key === "Enter") {
            buttonElement.click();
        }
    };
}

// Recuerda si hay un mensaje corto visible ahora mismo (y su temporizador para ocultarse).
// null = no hay ninguno visible.
let quickMessageTimeout = null;
let quickRestoreTimeout = null;

// Muestra un mensaje corto y transitorio de Yoro
// Si el mensaje anterior todavia esta visible, el texto cambia al instante sin fade 
//  Si ya se habia ocultado, aparece con el fade normal.
function showQuickMessage(text, { duration = 2000, restoreText = null } = {}) {
    const yaEstaVisible = quickMessageTimeout !== null;
    clearTimeout(quickMessageTimeout);
    clearTimeout(quickRestoreTimeout); // cancela una restauracion pendiente de un aviso anterior
    quickRestoreTimeout = null;

    dialogueParagraph.textContent = text;
    if (!yaEstaVisible) {
        dialogueContainer.style.opacity = 1;
    }

    quickMessageTimeout = setTimeout(() => {
        dialogueContainer.style.opacity = 0;
        quickMessageTimeout = null;

        if (restoreText) {
            quickRestoreTimeout = setTimeout(() => {
                dialogueParagraph.textContent = restoreText;
                dialogueContainer.style.opacity = 1;
                quickRestoreTimeout = null;
            }, FADE_DURATION);
        }
    }, duration);
}

// Evento 1. Juego: Adivina el numero (1)
function startGuessingGame(event) {
    const secretNumber = pickSecretNumber(10);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "number";

    let attempts = 0;

    guessButton.addEventListener("click", () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage("Escribe un número primero...");
            return;
        }
        const guess = Number(guessInput.value);
        attempts++;

        if (guess === secretNumber) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = `¡Lo lograste! :D`;
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
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
            showQuickMessage(`No es ese... (intento ${attempts})`);
        }
    });
}

//Evento 2. Juego: Adivina el numero 1.1
function startGuessingGame_1_1(event) {
    const secretNumber = pickSecretNumber(20);
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "number";

    let attempts = 0;

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage("Escribe un número primero...");
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
            showQuickMessage(guess < secretNumber ? "Más arriba..." : "Más abajo...");
        }
    };
}

//Evento 3. preguntaa el nombre al usuario
function askForName(event) {
    const nameUI = document.getElementById("name-ui");
    const nameInput = document.getElementById("name-input");
    const nameButton = document.getElementById("name-button");

    nameUI.classList.remove("hidden");
    enableEnterKey(nameInput, nameButton);

    nameButton.onclick = () => {
        const name = nameInput.value.trim();
        if (name.length < 3) {
            showQuickMessage("Necesito al menos 3 letras...");
            return;
        }

        localStorage.setItem("yoro_player_name", name);
        nameUI.classList.add("hidden");

        showDialogue(buildNameDialogue(name), () => {
            markEventCompleted(event.id);
            startIdleDialogues();
            showSkipTimeButton();
        });
    };
}

//Evento 4. Logica del juego, compartida entre ambos modos
function runGuessingGame_1_2(event, mode) {
    let secretNumber = pickSecretNumber(50);
    let failStreak = 0;
    let escapes = 0;

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "number";

    let attempts = 0;

    guessButton.onclick = () => {
        if (guessInput.value.trim() === "") {
            showQuickMessage("Escribe un número primero...");
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

                const hint = guess < secretNumber ? "Más arriba..." : "Más abajo...";
                hintText = result.changed
                    ? `El número secreto ha cambiado... Ahora está ${hint}`
                    : hint;
            }
            showQuickMessage(hintText);
        }
    };
}

// Evento 5. Juego: Cuenta Conmigo (suma y resta)
function startMathGame(event) {
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Responder";
    guessInput.type = "number";

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
            showQuickMessage("Escribe un número primero...", { restoreText: `${currentProblem.text} = ?` });
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

        showQuickMessage(correct ? "¡Correcto!" : `Casi... era ${currentProblem.answer}`, { duration: 1500 });

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
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Responder";
    guessInput.type = "number";

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
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
        if (stats.games.countWithMe.bestTen === null || hits > stats.games.countWithMe.bestTen) {
            stats.games.countWithMe.bestTen = hits;
            stats.games.countWithMe.modes.casual.plays++;
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
            showQuickMessage("Escribe un número primero...", { restoreText: `${currentProblem.text} = ?` });
            return;
        }
        guessButton.disabled = true;
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;
        let feedbackText;

        if (correct) {
            hits++;
            racha++;
            feedbackText = `¡Correcto! (racha: ${racha})`;
        } else {
            racha = 0;
            feedbackText = `Casi... era ${currentProblem.answer}`;
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
    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Responder";
    guessInput.type = "number";

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
        dialogueParagraph.textContent = `Fallaste... realizaste ${formatCount(attempts, "ejercicio", "ejercicios")}. ¡Tuviste ${formatCount(attempts - 1, "acierto", "aciertos")}!`;
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
        stats.games.countWithMe.modes.infinito.plays++;
        if (stats.games.countWithMe.bestInfinite === null || racha > stats.games.countWithMe.bestInfinite) {
            stats.games.countWithMe.bestInfinite = racha;
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
            showQuickMessage("Escribe un número primero...", { restoreText: `${currentProblem.text} = ?` });
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
            showQuickMessage(`¡Correcto! (${attempts} seguidos)`, { duration: 1200 });
            setTimeout(showProblem, 1200 + FADE_DURATION);
        } else {
            saveStats(stats);
            clearTimeout(quickRestoreTimeout);
            finishGame();
        }
    };

    showProblem();
}

// guarda titulo original
const originalTitle = document.title;
let awayTimeout1;
let awayTimeout2;

//cambia el titulo al salir de la pestania
document.addEventListener("visibilitychange", () => {
    clearTimeout(awayTimeout1);
    clearTimeout(awayTimeout2);

    if (document.hidden) {
        awayTimeout1 = setTimeout(() => {
            document.title = "¿Te vas...?";
        }, 2000);

        awayTimeout2 = setTimeout(() => {
            document.title = "¿Sigues ahí...?";
        }, 12000);
    } else {
        document.title = originalTitle;
    }
});

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

// Evento 7. Juego: Ahorcado (version base) - letra por letra o palabra completa, sin limite de intentos
function startHangmanGame(event) {
    const secretWord = pickSecretWord();

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");
    const hangmanStatus = document.getElementById("hangman-status");
    const hangmanHint = document.getElementById("hangman-hint");
    const hangmanProgress = document.getElementById("hangman-progress");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "text";
    guessInput.placeholder = "Una letra o la palabra...";

    let guessedLetters = [];
    let guessedWords = [];

    hangmanHint.textContent = `La palabra secreta tiene ${secretWord.length} letras`;
    updateProgress();
    hangmanStatus.classList.remove("hidden");

    function updateProgress() {
        hangmanProgress.textContent = secretWord.split("").map(char =>
            guessedLetters.includes(char) ? char : "_"
        ).join(" ");
    }

    function isWordFullyRevealed() {
        return secretWord.split("").every(char => guessedLetters.includes(char));
    }

    function finishGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;

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
        const raw = guessInput.value.trim().toLowerCase();
        guessInput.value = "";

        if (raw.length === 0) {
            showQuickMessage("Escribe una letra o una palabra...");
            return;
        }
        if (!/^[a-z]+$/.test(raw)) {
            showQuickMessage("Solo letras, nada de números ni símbolos...");
            return;
        }

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                showQuickMessage(`Ya probaste la letra "${letter}"`);
                return;
            }

            guessedLetters.push(letter);
            const count = countLetterOccurrences(secretWord, letter);
            const message = count > 0
                ? `La letra "${letter}" aparece ${count} ${count === 1 ? "vez" : "veces"} en la palabra secreta`
                : `La letra "${letter}" no aparece en la palabra secreta`;

            if (count > 0) updateProgress();

            if (isWordFullyRevealed()) {
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = `${message}. ¡Completaste la palabra! :D`;
                finishGame();
                return;
            }
            showQuickMessage(message);
            return;
        }

        if (raw.length === 2) {
            showQuickMessage("Ingresa solo una letra o una palabra completa");
            return;
        }

        if (guessedWords.includes(raw)) {
            showQuickMessage(`Ya intentaste la palabra "${raw}"`);
            return;
        }

        guessedWords.push(raw);
        if (isWordMatch(secretWord, raw)) {
            guessedLetters = getUniqueLetters(secretWord);
            updateProgress();
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
            finishGame();
            return;
        }
        showQuickMessage("Nope... no es esa");
    };
}

// Muestra la tabla de resultados del Ahorcado en lugar de Yoro, hasta que el jugador de click en "Aceptar"
function showHangmanResults(won, figureText, lines, onComplete) {
    const resultsUI = document.getElementById("hangman-results");
    const acceptButton = document.getElementById("hangman-results-accept");
    const yoroAvatar = document.getElementById("yoro-avatar");

    const title = won ? "¡Ganaste!" : "Perdiste...";
    const titleColor = won ? "text-primary-container" : "text-error";
    const subtitle = won
        ? "Descifraste la palabra a tiempo"
        : "El ahorcado se completó";

    resultsUI.innerHTML = `
        <pre class="text-label-code font-label-code leading-tight">${figureText}</pre>
        <h3 class="text-headline-md font-headline-md ${titleColor}">${title}</h3>
        <p class="text-body-md font-body-md opacity-70 mb-2">${subtitle}</p>
        <div class="flex flex-col gap-1">
            ${lines.map(line => `<p>${line}</p>`).join("")}
        </div>
    `;
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

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");
    const hangmanStatus = document.getElementById("hangman-status");
    const hangmanHint = document.getElementById("hangman-hint");
    const hangmanProgress = document.getElementById("hangman-progress");
    const hangmanFigure = document.getElementById("hangman-figure");
    const hangmanUsedButtons = document.getElementById("hangman-used-buttons");
    const hangmanLettersButton = document.getElementById("hangman-letters-button");
    const hangmanWordsButton = document.getElementById("hangman-words-button");
    const hangmanUsedModal = document.getElementById("hangman-used-modal");
    const hangmanUsedModalContent = document.getElementById("hangman-used-modal-content");
    const hangmanUsedCloseButton = document.getElementById("hangman-used-close-button");
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

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "text";
    guessInput.placeholder = "Una letra o la palabra...";

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
    hangmanStatus.classList.remove("hidden");
    hangmanUsedModal.classList.add("hidden");
    hangmanFigure.classList.remove("hidden");
    hangmanUsedButtons.classList.remove("hidden");

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
            guessedLetters.includes(char) ? char : "_"
        ).join(" ");
    }

    function updateHint() {
        hangmanHint.textContent = `La palabra secreta tiene ${secretWord.length} letras (${attemptsLeft()} vidas)`;
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
            hintCooldownText.textContent = "Pista disponible";
        } else {
            hintButton.disabled = true;
            hintButton.classList.remove("hint-ready");
            hintCooldownText.textContent = `Enfriamiento: ${remaining}`;
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

    // Abre el modal de letras/palabras usadas, reemplazando el dibujo ASCII dentro de la misma caja
    function openUsedModal(kind) {
        hangmanFigure.classList.add("hidden");
        hangmanUsedButtons.classList.add("hidden");

        const isLetters = kind === "letters";
        const items = isLetters ? guessedLetters : guessedWords;
        const label = isLetters ? "Letras usadas" : "Palabras usadas";

        hangmanUsedModalContent.textContent = items.length > 0
            ? `${label}: ${items.join(", ")}`
            : `${label}: ninguna todavía`;

        hangmanUsedModal.classList.remove("hidden");
    }

    // Cierra el modal y vuelve a mostrar el dibujo ASCII y los botones
    function closeUsedModal() {
        hangmanUsedModal.classList.add("hidden");
        hangmanFigure.classList.remove("hidden");
        hangmanUsedButtons.classList.remove("hidden");
    }

    hangmanLettersButton.onclick = () => openUsedModal("letters");
    hangmanWordsButton.onclick = () => openUsedModal("words");
    hangmanUsedCloseButton.onclick = closeUsedModal;

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
        let message = `Pista usada: la letra "${revealedLetter}" ya está revelada`;

        if (isWordFullyRevealed()) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = `${message}. ¡Completaste la palabra! :D`;
            endGame(true);
            return;
        }
        if (wrongGuesses >= maxWrongGuesses) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = `${message}. El ahorcado se completó...`;
            handleDefeat();
            return;
        }

        showQuickMessage(message);

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
        }, 2000);
    }

    function isWordFullyRevealed() {
        return secretWord.split("").every(char => guessedLetters.includes(char));
    }

    function formatAttemptCount(count) {
        return count === 0 ? "Ninguno" : count;
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
        hangmanLoseMessage.textContent = messageData.text;
        hangmanLoseCancel.textContent = messageData.cancelLabel;
        hangmanLoseAccept.textContent = messageData.acceptLabel;
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
            `Modo de juego: ${mode === "casual" ? "Casual" : mode === "desafio" ? "Desafío" : "Experto"}`,
            won
                ? `Palabra secreta encontrada: ${secretWord}`
                : `Palabra secreta que buscabas: ${secretWord}`,
            !won ? `Estado final de tu búsqueda: ${hangmanProgress.textContent}` : null,
            `Intentos de adivinar letra: ${letterAttemptsUsed}`,
            `Intentos de adivinar palabra: ${formatAttemptCount(wordAttemptsUsed)}`,
            hintsEnabled ? `Pistas usadas: ${hintsUsedCount}` : null,
            `Vidas restantes: ${attemptsLeft()}`
        ].filter(line => line !== null);

        showHangmanResults(won, finalFigureText, resultLines, () => {
            hintButton.classList.add("hidden");
            hintCooldownText.classList.add("hidden");
            hangmanGithubPrompt.classList.add("hidden");
            hangmanLoseMenu.classList.add("hidden");
            hangmanRewardModal.classList.add("hidden");
            guessInput.disabled = false;
            guessButton.disabled = false;
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
                dialogueParagraph.textContent = "¡Gracias por el apoyo! Recibiste 3 vidas extra";
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
        const raw = guessInput.value.trim().toLowerCase();
        guessInput.value = "";

        if (raw.length === 0) {
            showQuickMessage("Escribe una letra o una palabra...");
            return;
        }
        if (!/^[a-z]+$/.test(raw)) {
            showQuickMessage("Solo letras, nada de números ni símbolos...");
            return;
        }

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                showQuickMessage(`Ya probaste la letra "${letter}" antes, este intento no cuenta jeje`);
                return;
            }

            guessedLetters.push(letter);
            letterAttemptsUsed++;

            const count = countLetterOccurrences(secretWord, letter);
            const message = count > 0
                ? `La letra "${letter}" aparece ${count} ${count === 1 ? "vez" : "veces"} en la palabra secreta`
                : `La letra "${letter}" no aparece en la palabra secreta`;

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
                dialogueParagraph.textContent = `${message}. ¡Completaste la palabra! :D`;
                endGame(true);
                return;
            }
            if (wrongGuesses >= maxWrongGuesses) {
                dialogueContainer.style.opacity = 1;
                dialogueParagraph.textContent = `${message}. El ahorcado se completó...`;
                handleDefeat();
                return;
            }
            showQuickMessage(message);
            return;
        }

        if (raw.length === 2) {
            showQuickMessage("Ingresa solo una letra o una palabra completa");
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
                dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
                endGame(true);
            } else {
                wrongGuesses = maxWrongGuesses;
                updateFigure();
                updateGithubPrompt();
                dialogueParagraph.textContent = "Nope... esa no era, perdiste tu único intento de palabra";
                handleDefeat();
            }
            return;
        }

        // mode === "casual": la palabra completa se puede intentar varias veces
        if (guessedWords.includes(raw)) {
            showQuickMessage(`Ya probaste la palabra "${raw}" antes, este intento no cuenta jeje`);
            return;
        }

        guessedWords.push(raw);
        wordAttemptsUsed++;

        if (isWordMatch(secretWord, raw)) {
            guessedLetters = getUniqueLetters(secretWord);
            updateProgress();
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
            endGame(true);
            return;
        }

        wrongGuesses++;
        updateHint();
        updateFigure();
        updateGithubPrompt();

        if (wrongGuesses >= maxWrongGuesses) {
            dialogueContainer.style.opacity = 1;
            dialogueParagraph.textContent = "Nope... no es esa. El ahorcado se completó...";
            handleDefeat();
            return;
        }
        showQuickMessage("Nope... no es esa");
    };
}

// Panel de opciones (engranaje): cubre toda la pantalla mientras esta abierto
const settingsButton = document.getElementById("settings-button");
const settingsPanel = document.getElementById("settings-panel");
const settingsCloseButton = document.getElementById("settings-close-button");

function openSettingsPanel() {
    // quita el foco del input del juego, para que Enter no dispare el boton de abajo
    if (document.activeElement) document.activeElement.blur();
    showSettingsOptions();
    changeNameOption.classList.toggle("hidden", !localStorage.getItem("yoro_player_name"));
    settingsPanel.classList.remove("hidden");
}

function closeSettingsPanel() {
    settingsPanel.classList.add("hidden");
}

// Los clicks de aqui no deben llegar al listener global de events.js,
// o saltarian la pausa del dialogo que haya detras.
settingsButton.onclick = (clickEvent) => {
    clickEvent.stopPropagation();
    openSettingsPanel();
};
settingsPanel.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
settingsCloseButton.onclick = closeSettingsPanel;

// Opcion "Cambiar mi nombre" del panel de opciones
const settingsOptions = document.getElementById("settings-options");
const settingsNameForm = document.getElementById("settings-name-form");
const settingsNameInput = document.getElementById("settings-name-input");
const settingsNameSave = document.getElementById("settings-name-save");
const settingsNameCancel = document.getElementById("settings-name-cancel");
const settingsMessage = document.getElementById("settings-message");
const changeNameOption = document.querySelector('[data-option="change-name"]');

enableEnterKey(settingsNameInput, settingsNameSave);

// vuelve a la lista de opciones y limpia el mensaje
function showSettingsOptions() {
    settingsNameForm.classList.add("hidden");
    settingsConfirm.classList.add("hidden");
    settingsOptions.classList.remove("hidden");
    settingsMessage.textContent = "";
    pendingConfirmAction = null;
    pendingDeclineAction = null;
}

changeNameOption.onclick = () => {
    settingsMessage.textContent = "";
    settingsOptions.classList.add("hidden");
    settingsNameForm.classList.remove("hidden");
    settingsNameInput.value = localStorage.getItem("yoro_player_name") || "";
    settingsNameInput.focus();
};

settingsNameCancel.onclick = showSettingsOptions;

settingsNameSave.onclick = () => {
    const name = settingsNameInput.value.trim();
    if (name.length < 3) {
        settingsMessage.textContent = "Necesito al menos 3 letras...";
        return;
    }

    const previousName = localStorage.getItem("yoro_player_name");
    localStorage.setItem("yoro_player_name", name);
    showSettingsOptions();

    // mismo nombre: Yoro no finge que es uno nuevo
    if (name === previousName) {
        settingsMessage.textContent = `Sigue siendo ${name}, jeje`;
        return;
    }

    const reactions = [
        `${name}... me gusta, jeje`,
        `¿Nuevo nombre? Hola de nuevo, ${name}`,
        `${name}. Listo, lo recordaré`
    ];
    settingsMessage.textContent = reactions[Math.floor(Math.random() * reactions.length)];
};

// Confirmacion generica del panel de opciones (para acciones que borran datos)
const settingsConfirm = document.getElementById("settings-confirm");
const settingsConfirmText = document.getElementById("settings-confirm-text");
const settingsConfirmAccept = document.getElementById("settings-confirm-accept");
const settingsConfirmCancel = document.getElementById("settings-confirm-cancel");
const resetStatsOption = document.querySelector('[data-option="reset-stats"]');
const resetGameOption = document.querySelector('[data-option="reset-game"]');

// acciones pendientes segun el boton que se pulse (null = no hay ninguna)
let pendingConfirmAction = null;
let pendingDeclineAction = null;

// Muestra la confirmacion. Opciones: textos de los botones y "onCancel":
// si se pasa, el boton izquierdo ejecuta esa accion (despues de volver a la lista de opciones)
function showSettingsConfirm(text, onAccept, { acceptLabel = "Aceptar", cancelLabel = "Cancelar", onCancel = null } = {}) {
    settingsMessage.textContent = "";
    pendingConfirmAction = onAccept;
    pendingDeclineAction = onCancel;
    settingsConfirmText.textContent = text;
    settingsConfirmAccept.textContent = acceptLabel;
    settingsConfirmCancel.textContent = cancelLabel;
    settingsOptions.classList.add("hidden");
    settingsConfirm.classList.remove("hidden");
}

settingsConfirmCancel.onclick = () => {
    const action = pendingDeclineAction; // se guarda antes, porque showSettingsOptions la borra
    showSettingsOptions();
    if (action) action();
};

settingsConfirmAccept.onclick = () => {
    const action = pendingConfirmAction;
    showSettingsOptions();
    if (action) action();
};

resetStatsOption.onclick = () => {
    showSettingsConfirm("Se borrarán tus estadísticas: visitas, partidas y récords. No se puede deshacer.", () => {
        // se cambia el contenido del mismo objeto "stats" (no se crea uno nuevo),
        // para que todo el codigo que ya lo usa vea los datos reiniciados
        Object.assign(stats, createInitialStats());
        stats.visits = 1;
        stats.daysVisited = 1;
        stats.lastVisitDay = getTodayKey();
        stats.firstVisitDay = getTodayKey();
        saveStats(stats);
        settingsMessage.textContent = "Listo, empezamos de cero";
    });
};

// Borra el progreso (eventos completados y nombre) y recarga la pagina para que Yoro empiece de cero.
// Las estadisticas solo se reinician si resetStatsToo es true.
function resetGame(resetStatsToo) {
    localStorage.removeItem("yoro_completed_events");
    localStorage.removeItem("yoro_player_name");

    if (resetStatsToo) {
        // visits queda en 0 porque la recarga de abajo ya suma la visita nueva
        Object.assign(stats, createInitialStats());
        saveStats(stats);
    }

    location.reload();
}

resetGameOption.onclick = () => {
    showSettingsConfirm("¿Mantener estadísticas actuales?", () => resetGame(false), {
        acceptLabel: "Sí",
        cancelLabel: "No",
        onCancel: () => resetGame(true)
    });
};


// Panel de estadisticas (boton de grafico): cubre toda la pantalla mientras esta abierto
const statsButton = document.getElementById("stats-button");
const statsPanel = document.getElementById("stats-panel");
const statsCloseButton = document.getElementById("stats-close-button");
const statsGeneralList = document.getElementById("stats-general-list");

// nombres de los juegos, con las mismas claves que stats.games
const gameNames = {
    number: "Adivina el Número",
    countWithMe: "Cuenta Conmigo",
    hangman: "Ahorcado"
};

// convierte "2026-10-14" en "14/10/2026" (o un guion si todavia no hay fecha)
function formatStatDate(dayKey) {
    if (!dayKey) return "—";
    const [year, month, day] = dayKey.split("-");
    return `${day}/${month}/${year}`;
}

// el juego con mas plays; en caso de empate gana el primero de la lista; sin partidas, un guion
function getMostPlayedGame() {
    let bestName = null;
    let bestPlays = 0;

    Object.keys(gameNames).forEach(key => {
        const plays = stats.games[key].plays;
        if (plays > bestPlays) {
            bestPlays = plays;
            bestName = gameNames[key];
        }
    });

    return bestName === null ? "—" : bestName;
}

// arma las filas de la vista general con los datos actuales
function renderStatsGeneral() {
    const games = stats.games;
    const totalPlays = games.number.plays + games.countWithMe.plays + games.hangman.plays;
    const winRate = formatPercent(games.hangman.wins, games.hangman.plays);
    const playerName = localStorage.getItem("yoro_player_name") || "—";

    const rows = [
        ["Nombre", playerName],
        ["Visitas", stats.visits],
        ["Días de visita", stats.daysVisited],
        ["Primera visita", formatStatDate(stats.firstVisitDay)],
        ["Partidas totales", totalPlays],
        ["Juego más jugado", getMostPlayedGame()],
        ["Índice de victoria (Ahorcado)", winRate]
    ];

    fillStatRows(statsGeneralList, rows);
}

function openStatsPanel() {
    // quita el foco del input del juego, para que Enter no dispare el boton de abajo
    if (document.activeElement) document.activeElement.blur();
    renderStatsGeneral();
    showStatsGeneral();
    statsPanel.classList.remove("hidden");
}

function closeStatsPanel() {
    statsPanel.classList.add("hidden");
}

// igual que en Ajustes: los clicks de aqui no deben llegar al listener global de events.js
statsButton.onclick = (clickEvent) => {
    clickEvent.stopPropagation();
    openStatsPanel();
};
statsPanel.addEventListener("click", (clickEvent) => clickEvent.stopPropagation());
statsCloseButton.onclick = closeStatsPanel;


// ---- Pantallas de detalle por juego ----
const statsGeneralView = document.getElementById("stats-general");
const statsDetailView = document.getElementById("stats-detail");
const statsDetailTitle = document.getElementById("stats-detail-title");
const statsDetailSections = document.getElementById("stats-detail-sections");
const statsDetailButtons = document.getElementById("stats-detail-buttons");
const statsBackButton = document.getElementById("stats-back-button");

// porcentaje redondeado, o un guion si todavia no hay datos
function formatPercent(part, total) {
    return total > 0 ? `${Math.round(part / total * 100)}%` : "—";
}

// promedio con un decimal como maximo, o un guion si no hay datos
function formatAverage(total, count) {
    return count > 0 ? Math.round(total / count * 10) / 10 : "—";
}

// un valor que puede ser null (todavia sin dato): lo muestra tal cual o un guion
function formatOrDash(value) {
    return value === null ? "—" : value;
}

// un valor con su unidad en singular o plural ("1 vida", "6 vidas"), o un guion si no hay dato
function formatCount(value, singular, plural) {
    if (value === null) return "—";
    return `${value} ${value === 1 ? singular : plural}`;
}

// llena un contenedor con filas "etiqueta ... valor" (todo como texto plano)
function fillStatRows(container, rows) {
    container.innerHTML = "";
    rows.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "flex justify-between gap-4";

        const labelSpan = document.createElement("span");
        labelSpan.className = "opacity-70";
        labelSpan.textContent = label;

        const valueSpan = document.createElement("span");
        valueSpan.className = "text-right";
        valueSpan.textContent = value;

        row.append(labelSpan, valueSpan);
        container.appendChild(row);
    });
}

// Cada juego devuelve su lista de cajas: { title, rows: [[etiqueta, valor], ...] }
// Las claves coinciden con stats.games y con data-game de los botones.
const statsDetailBuilders = {
    number: () => {
        const n = stats.games.number;
        const modeRows = (mode) => [
            ["Partidas", mode.plays],
            ["Mejor partida", formatCount(mode.bestAttempts, "intento", "intentos")],
            ["Promedio de intentos", formatAverage(mode.totalAttempts, mode.plays)]
        ];

        return [
            {
                title: "General", rows: [
                    ["Partidas", n.plays],
                    ["Mejor partida", formatCount(n.bestAttempts, "intento", "intentos")],
                    ["Intentos totales", n.totalAttempts],
                    ["Promedio de intentos", formatAverage(n.totalAttempts, n.plays)]
                ]
            },
            { title: "Casual", rows: modeRows(n.modes.casual) },
            { title: "Desafío", rows: [...modeRows(n.modes.desafio), ["Escapes del número", n.modes.desafio.escapes]] }
        ];
    },

    countWithMe: () => {
        const c = stats.games.countWithMe;
        const casual = c.modes.casual;
        const infinito = c.modes.infinito;

        return [
            {
                title: "General", rows: [
                    ["Partidas", c.plays],
                    ["Respuestas totales", c.totalAnswers],
                    ["Aciertos", c.correctAnswers],
                    ["Precisión", formatPercent(c.correctAnswers, c.totalAnswers)]
                ]
            },
            {
                title: "Casual", rows: [
                    ["Partidas", casual.plays],
                    ["Mejor puntaje", c.bestTen === null ? "—" : `${c.bestTen}/10`],
                    ["Mejor racha", formatOrDash(casual.bestStreak)],
                    ["Precisión", formatPercent(casual.correctAnswers, casual.totalAnswers)]
                ]
            },
            {
                title: "Infinito", rows: [
                    ["Partidas", infinito.plays],
                    ["Mejor racha", formatOrDash(c.bestInfinite)],
                    ["Precisión", formatPercent(infinito.correctAnswers, infinito.totalAnswers)]
                ]
            }
        ];
    },

    hangman: () => {
        const h = stats.games.hangman;
        const experto = h.modes.experto;
        // el total (h) y cada modo tienen los mismos campos, asi que comparten esta funcion
        const modeRows = (mode) => [
            ["Partidas", mode.plays],
            ["Victorias", mode.wins],
            ["Derrotas", mode.losses],
            ["Índice de victoria", formatPercent(mode.wins, mode.plays)],
            ["Mejor partida", formatCount(mode.bestMargin, "vida", "vidas")]
        ];

        return [
            { title: "General", rows: modeRows(h) },
            { title: "Casual", rows: modeRows(h.modes.casual) },
            { title: "Desafío", rows: modeRows(h.modes.desafio) },
            {
                title: "Experto", rows: [
                    ...modeRows(experto),
                    ["Pistas usadas", experto.hintsUsed],
                    ["Veces que revivió", experto.revives]
                ]
            }
        ];
    }
};

// muestra la pantalla de detalle del juego indicado (arma una caja por cada seccion)
function showStatsDetail(gameKey) {
    statsDetailTitle.textContent = gameNames[gameKey];
    statsDetailSections.innerHTML = "";

    statsDetailBuilders[gameKey]().forEach(section => {
        const box = document.createElement("div");
        box.className = "panel-box-soft flex flex-col gap-2 w-full md:w-52";

        const title = document.createElement("h4");
        title.className = "text-label-technical font-label-technical uppercase text-primary-container";
        title.textContent = section.title;

        const list = document.createElement("div");
        list.className = "flex flex-col gap-1 text-body-md font-body-md";
        fillStatRows(list, section.rows);

        box.append(title, list);
        statsDetailSections.appendChild(box);
    });

    statsGeneralView.classList.add("hidden");
    statsDetailView.classList.remove("hidden");
}

// vuelve a la vista general
function showStatsGeneral() {
    statsDetailView.classList.add("hidden");
    statsGeneralView.classList.remove("hidden");
}

// delegacion de eventos, igual que en los menus de juego y de modo
statsDetailButtons.onclick = (clickEvent) => {
    const button = clickEvent.target.closest("button[data-game]");
    if (!button) return;
    showStatsDetail(button.dataset.game);
};
statsBackButton.onclick = showStatsGeneral;