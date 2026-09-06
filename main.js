// carga estadisticas y registra la visita actual
const stats = loadStats();
stats.visits++;
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
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = `¡Lo lograste! :D`;
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
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
            dialogueParagraph.textContent = `No es ese... (intento ${attempts})`;
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
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
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = getResultMessage(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
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
            dialogueParagraph.textContent = guess < secretNumber ? "Más arriba..." : "Más abajo...";
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
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
        if (!name) return;

        localStorage.setItem("yoro_player_name", name);
        nameUI.classList.add("hidden");

        showDialogue(buildNameDialogue(name), () => {
            markEventCompleted(event.id);
            startIdleDialogues();
        });
    };
}

//Evento 4. Logica del juego, compartida entre ambos modos
function runGuessingGame_1_2(event, mode) {
    let secretNumber = pickSecretNumber(50);
    let failStreak = 0;

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "number";

    let attempts = 0;

    guessButton.onclick = () => {
        const guess = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;

        if (guess === secretNumber) {
            dialogueParagraph.textContent = mode === "casual"
                ? getResultMessageCasual(attempts)
                : getResultMessageDesafio(attempts);
            guessInput.disabled = true;
            guessButton.disabled = true;

            stats.games.number.plays++;
            stats.games.number.wins++;
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
            if (mode === "casual") {
                dialogueParagraph.textContent = getHintCasual(secretNumber, guess);
            } else {
                const result = handleDesafioFail(secretNumber, failStreak);
                secretNumber = result.secretNumber;
                failStreak = result.failStreak;

                const hint = guess < secretNumber ? "Más arriba..." : "Más abajo...";
                dialogueParagraph.textContent = result.changed
                    ? `El número secreto ha cambiado... Ahora está ${hint}`
                    : hint;
            }
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
            }, 2000);
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
        currentProblem = generateMathProblem();
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
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
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;
        if (correct) hits++;
        problemIndex++;

        stats.games.countWithMe.totalAnswers++;
        if (correct) stats.games.countWithMe.correctAnswers++;
        saveStats(stats);

        dialogueParagraph.textContent = correct ? "¡Correcto!" : `Casi... era ${currentProblem.answer}`;
        dialogueContainer.style.opacity = 1;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                if (problemIndex >= totalProblems) {
                    finishGame();
                } else {
                    showProblem();
                }
            }, FADE_DURATION);
        }, 1500);
    };

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
        const answer = Number(guessInput.value);
        const correct = answer === currentProblem.answer;

        if (correct) {
            hits++;
            racha++;
            dialogueParagraph.textContent = `¡Correcto! (racha: ${racha})`;
        } else {
            racha = 0;
            dialogueParagraph.textContent = `Casi... era ${currentProblem.answer}`;
        }

        stats.games.countWithMe.totalAnswers++;
        if (correct) stats.games.countWithMe.correctAnswers++;
        saveStats(stats);

        problemIndex++;
        dialogueContainer.style.opacity = 1;

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
            setTimeout(() => {
                if (problemIndex >= totalProblems) {
                    finishGame();
                } else {
                    showProblem();
                }
            }, FADE_DURATION);
        }, 1500);
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
        currentProblem = generateMathProblem(maxRange);
        guessInput.value = "";
        dialogueParagraph.textContent = `${currentProblem.text} = ?`;
        dialogueContainer.style.opacity = 1;
    }

    function finishGame() {
        const racha = attempts - 1;
        dialogueParagraph.textContent = `Fallaste... realizaste ${attempts} ejercicios ¡Fueron ${attempts - 1} aciertos!`;
        dialogueContainer.style.opacity = 1;
        guessInput.disabled = true;
        guessButton.disabled = true;

        stats.games.countWithMe.plays++;
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
        const answer = Number(guessInput.value);
        attempts++;
        dialogueContainer.style.opacity = 1;
        stats.games.countWithMe.totalAnswers++;

        if (answer === currentProblem.answer) {
            stats.games.countWithMe.correctAnswers++; saveStats(stats);
            dialogueParagraph.textContent = `¡Correcto! (${attempts} seguidos)`;
            setTimeout(() => {
                dialogueContainer.style.opacity = 0;
                setTimeout(showProblem, FADE_DURATION);
            }, 1200);
        } else {
            saveStats(stats);
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
        if (raw.length === 0) return;

        dialogueContainer.style.opacity = 1;

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                dialogueParagraph.textContent = `Ya probaste la letra "${letter}"`;
            } else {
                guessedLetters.push(letter);
                const count = countLetterOccurrences(secretWord, letter);
                if (count > 0) {
                    dialogueParagraph.textContent = `La letra "${letter}" aparece ${count} ${count === 1 ? "vez" : "veces"} en la palabra secreta`;
                    updateProgress();
                } else {
                    dialogueParagraph.textContent = `La letra "${letter}" no aparece en la palabra secreta`;
                }
            }
        } else if (raw.length === 2) {
            dialogueParagraph.textContent = "Ingresa solo una letra o una palabra completa";
        } else {
            if (guessedWords.includes(raw)) {
                dialogueParagraph.textContent = `Ya intentaste la palabra "${raw}"`;
            } else {
                guessedWords.push(raw);
                if (isWordMatch(secretWord, raw)) {
                    dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
                    guessedLetters = getUniqueLetters(secretWord);
                    updateProgress();
                    finishGame();
                    return;
                } else {
                    dialogueParagraph.textContent = "Nope... no es esa";
                }
            }
        }

        if (raw.length === 1 && isWordFullyRevealed()) {
            dialogueParagraph.textContent = "¡Completaste la palabra! :D";
            finishGame();
            return;
        }

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
        }, 2000);
    };
}

// Muestra la tabla de resultados del Ahorcado en lugar de Yoro, hasta que el jugador de click en "Aceptar"
function showHangmanResults(won, lines, onComplete) {
    const resultsUI = document.getElementById("hangman-results");
    const acceptButton = document.getElementById("hangman-results-accept");
    const yoroAvatar = document.getElementById("yoro-avatar");

    const title = won ? "¡Ganaste!" : "Perdiste...";
    const titleColor = won ? "text-primary-container" : "text-error";
    const subtitle = won
        ? "Descifraste la palabra a tiempo"
        : "El ahorcado se completó";

    resultsUI.innerHTML = `
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
// Evento 8. Ahorcado 1.1: logica compartida entre modo Casual y Desafio
function runHangmanGame_1_1(event, mode) {
    const secretWord = pickSecretWord();
    const stages = mode === "casual" ? hangmanStagesCasual : hangmanStagesDesafio;
    const maxWrongGuesses = stages.length - 1; // el ultimo indice del arreglo es la figura completa (perdida)

    const gameUI = document.getElementById("game-ui");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");
    const hangmanStatus = document.getElementById("hangman-status");
    const hangmanHint = document.getElementById("hangman-hint");
    const hangmanProgress = document.getElementById("hangman-progress");
    const hangmanFigureWrapper = document.getElementById("hangman-figure-wrapper");
    const hangmanFigure = document.getElementById("hangman-figure");
    const hangmanUsed = document.getElementById("hangman-used");

    gameUI.classList.remove("hidden");
    enableEnterKey(guessInput, guessButton);
    guessButton.textContent = "Adivinar";
    guessInput.type = "text";
    guessInput.placeholder = "Una letra o la palabra...";

    let guessedLetters = [];
    let guessedWords = [];
    let letterAttemptsUsed = 0;
    let wordAttemptsUsed = 0;
    let wordGuessUsed = false; // solo relevante en desafio
    let wrongGuesses = 0;

    updateHint();
    updateProgress();
    updateFigure();
    updateUsedList();
    hangmanStatus.classList.remove("hidden");
    hangmanFigureWrapper.classList.remove("hidden");

    function attemptsLeft() {
        return maxWrongGuesses - wrongGuesses;
    }

    function updateProgress() {
        hangmanProgress.textContent = secretWord.split("").map(char =>
            guessedLetters.includes(char) ? char : "_"
        ).join(" ");
    }

    function updateHint() {
        hangmanHint.textContent = `La palabra secreta tiene ${secretWord.length} letras (${attemptsLeft()} intentos)`;
    }

    function updateFigure() {
        const stageIndex = Math.min(wrongGuesses, stages.length - 1);
        hangmanFigure.textContent = stages[stageIndex];
    }

    function updateUsedList() {
        const parts = [];
        if (guessedLetters.length > 0) parts.push(`Letras usadas: ${guessedLetters.join(", ")}`);
        if (guessedWords.length > 0) parts.push(`Palabras intentadas: ${guessedWords.join(", ")}`);
        hangmanUsed.textContent = parts.join(" · ");
    }

    function isWordFullyRevealed() {
        return secretWord.split("").every(char => guessedLetters.includes(char));
    }

    function formatAttemptCount(count) {
        return count === 0 ? "Ninguno" : count;
    }

    function endGame(won) {
        guessInput.disabled = true;
        guessButton.disabled = true;
        gameUI.classList.add("hidden");
        hangmanStatus.classList.add("hidden");

        const resultLines = [
            `Modo de juego: ${mode === "casual" ? "Casual" : "Desafío"}`,
            won
                ? `Palabra secreta encontrada: ${secretWord}`
                : `Palabra secreta que buscabas: ${secretWord}`,
            !won ? `Estado final de tu búsqueda: ${hangmanProgress.textContent}` : null,
            `Intentos de adivinar letra: ${letterAttemptsUsed}`,
            `Intentos de adivinar palabra: ${formatAttemptCount(wordAttemptsUsed)}`,
            `Intentos sobrantes: ${attemptsLeft()}`
        ].filter(line => line !== null);

        showHangmanResults(won, resultLines, () => {
            hangmanFigureWrapper.classList.add("hidden");
            guessInput.disabled = false;
            guessButton.disabled = false;
            finishEvent(event);
        });
    }

    guessButton.onclick = () => {
        const raw = guessInput.value.trim().toLowerCase();
        guessInput.value = "";
        if (raw.length === 0) return;

        dialogueContainer.style.opacity = 1;

        if (raw.length === 1) {
            const letter = raw;
            if (guessedLetters.includes(letter)) {
                dialogueParagraph.textContent = `Ya probaste la letra "${letter}" antes, este intento no cuenta jeje`;
            } else {
                guessedLetters.push(letter);
                letterAttemptsUsed++;

                const count = countLetterOccurrences(secretWord, letter);
                const message = count > 0
                    ? `La letra "${letter}" aparece ${count} ${count === 1 ? "vez" : "veces"} en la palabra secreta`
                    : `La letra "${letter}" no aparece en la palabra secreta`;

                if (count === 0) wrongGuesses++;
                updateProgress();
                updateHint();
                updateFigure();
                updateUsedList();

                if (isWordFullyRevealed()) {
                    dialogueParagraph.textContent = `${message}. ¡Completaste la palabra! :D`;
                    endGame(true);
                    return;
                }
                if (wrongGuesses >= maxWrongGuesses) {
                    dialogueParagraph.textContent = `${message}. El ahorcado se completó...`;
                    endGame(false);
                    return;
                }
                dialogueParagraph.textContent = message;
            }
        } else if (raw.length === 2) {
            dialogueParagraph.textContent = "Ingresa solo una letra o una palabra completa";
        } else if (mode === "desafio") {
            if (wordGuessUsed) return; // no deberia poder pasar, la partida ya termino en el primer intento
            wordGuessUsed = true;
            wordAttemptsUsed++;
            guessedWords.push(raw);
            updateUsedList();

            if (isWordMatch(secretWord, raw)) {
                guessedLetters = getUniqueLetters(secretWord);
                updateProgress();
                dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
                endGame(true);
            } else {
                wrongGuesses = maxWrongGuesses; // se muestra la figura completa al perder asi
                updateFigure();
                dialogueParagraph.textContent = "Nope... esa no era, perdiste tu único intento de palabra";
                endGame(false);
            }
            return;
        } else {
            if (guessedWords.includes(raw)) {
                dialogueParagraph.textContent = `Ya probaste la palabra "${raw}" antes, este intento no cuenta jeje`;
            } else {
                guessedWords.push(raw);
                wordAttemptsUsed++;
                updateUsedList();

                if (isWordMatch(secretWord, raw)) {
                    guessedLetters = getUniqueLetters(secretWord);
                    updateProgress();
                    dialogueParagraph.textContent = "¡Esa es! La adivinaste :D";
                    endGame(true);
                    return;
                }

                wrongGuesses++;
                updateHint();
                updateFigure();

                if (wrongGuesses >= maxWrongGuesses) {
                    dialogueParagraph.textContent = "Nope... no es esa. El ahorcado se completó...";
                    endGame(false);
                    return;
                }
                dialogueParagraph.textContent = "Nope... no es esa";
            }
        }

        setTimeout(() => {
            dialogueContainer.style.opacity = 0;
        }, 2000);
    };
}