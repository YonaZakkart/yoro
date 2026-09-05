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