// Banco de palabras para el Ahorcado (version base).
// Todas en minusculas y sin tildes para simplificar la comparacion letra por letra.
const hangmanWords = [
    "sol", "mar", "pan", "luz", "rey", "voz", "pie", "oso", "tos", "eje",
    "casa", "perro", "gato", "libro", "mesa", "silla", "puerta", "ventana",
    "flor", "arbol", "nube", "lluvia", "monte", "playa", "rio", "isla",
    "coche", "avion", "barco", "tren", "bicicleta", "camino", "puente",
    "cancion", "musica", "pintura", "letra", "numero", "juego", "robot",
    "pantalla", "teclado", "internet", "programa", "codigo", "pixel",
    "manzana", "naranja", "platano", "sandia", "fresa", "limon",
    "elefante", "jirafa", "tortuga", "conejo", "dragon", "mono"
];

// elige una palabra al azar del banco
function pickSecretWord() {
    const index = Math.floor(Math.random() * hangmanWords.length);
    return hangmanWords[index];
}

// devuelve un arreglo con las letras unicas de la palabra (sin repetir)
// ej: "banana" -> ["b", "a", "n"]
function getUniqueLetters(word) {
    return [...new Set(word.split(""))];
}

// cuenta cuantas veces aparece una letra dentro de la palabra secreta
function countLetterOccurrences(word, letter) {
    return word.split("").filter(char => char === letter).length;
}

// compara si la palabra ingresada coincide exactamente con la palabra secreta
function isWordMatch(secretWord, guess) {
    return secretWord === guess.trim().toLowerCase();
}