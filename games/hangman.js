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

/// Estados del dibujo ASCII del ahorcado en modo Casual: indice 0 = sin fallos, ultimo indice = perdida
const hangmanStagesCasual = [
`
 
    
     
     
     
     
=========`,
`
 
    
     
     
     
     |
=========`,
`
 
    
     
     
     |
     |
=========`,
`

    
     
     |
     |
     |
=========`,
`
 

     |
     |
     |
     |
=========`,
`

     |
     |
     |
     |
     |
=========`,
`
     +
     |
     |
     |
     |
     |
=========`,
`
  ---+
     |
     |
     |
     |
     |
=========`,
`
 +---+
     |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
];

// Estados del dibujo ASCII del ahorcado en modo Desafio: indice 0 = sin fallos, ultimo indice = perdida
const hangmanStagesDesafio = [
`
 
 
 
 
 
 
=========`,
`
 
 
 
 
     |
     |
=========`,
`
  
     
     |
     |
     |
     |
=========`,
`
     +
     |
     |
     |
     |
     |
=========`,
`
  ---+
     |
     |
     |
     |
     |
=========`,
`
 +---+
     |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
];

// Banco de palabras exclusivo para el modo Experto: todas de 6 letras o mas.
// Igual que el banco base, en minusculas y sin tildes ni "ñ".
const hangmanWordsExperto = [
    "bicicleta", "elefante", "mariposa", "cocodrilo", "escalera", "ventanal",
    "biblioteca", "calendario", "escritorio", "murcielago", "relampago",
    "desierto", "tsunami", "iceberg", "cascada", "senderismo", "telescopio",
    "microscopio", "algoritmo", "servidor", "software", "hardware", "bateria",
    "cargador", "auricular", "avestruz", "iguana", "delfin", "sirena",
    "brujula", "esfinge", "cometa", "planeta", "cristal", "diamante",
    "esmeralda", "zafiro", "turquesa", "topacio"
];

// elige una palabra al azar del banco exclusivo de Experto
function pickSecretWordExperto() {
    const index = Math.floor(Math.random() * hangmanWordsExperto.length);
    return hangmanWordsExperto[index];
}

// Estados del dibujo ASCII del Ahorcado en modo Experto: 11 elementos
// (indice 0 = sin fallos, indice 10 = perdida) -> 10 intentos reales.
const hangmanStagesExperto = [
`
 
 
 
 
 
 
=========`,
`
 
 
 
     |
     |
     |
=========`,
`
  
     |
     |
     |
     |
     |
=========`,
`
 +---+
     |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
     |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
     |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
`
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
];

// Mensajes al perder en modo Experto: se elige uno al azar, cada uno con su propio enlace
const loseMessages = [
    {
        text: "Has perdido...\nSigue al creador y quizá te de otra oportunidad",
        cancelLabel: "No gracias",
        acceptLabel: "Sigue a Yona en GitHub",
        url: "https://github.com/YonaZakkart"
    },
    {
        text: "Has perdido.\nUna ⭐ podría cambiar tu destino...",
        cancelLabel: "No gracias",
        acceptLabel: "Marca con una estrella el repositorio",
        url: "https://github.com/YonaZakkart/yoro"
    },
    {
        text: "Has perdido.\nEntra al repositorio, busca \"Star\" y dale click.\nQuizá pase algo...",
        cancelLabel: "No quiero",
        acceptLabel: "Intentar mi suerte",
        url: "https://github.com/YonaZakkart/yoro"
    }
];