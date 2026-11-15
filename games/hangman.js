// Bancos de palabras del Ahorcado, uno por idioma.
// Español: con tildes, ü y ñ reales; al jugar, las vocales con tilde o diéresis cuentan como
// la vocal simple ("o" revela "ó"), pero la ñ es una letra propia. Inglés: solo a-z.

// Modo base, Casual y Desafío
const hangmanWords = {
    es: [
        "sol", "mar", "pan", "luz", "rey", "voz", "pie", "oso", "tos", "eje", "casa", "perro",
        "gato", "libro", "mesa", "silla", "puerta", "ventana", "flor", "árbol", "nube", "lluvia",
        "monte", "playa", "río", "isla", "coche", "avión", "barco", "tren", "bicicleta", "camino",
        "puente", "canción", "música", "pintura", "letra", "número", "juego", "robot", "pantalla",
        "teclado", "internet", "programa", "código", "píxel", "manzana", "naranja", "plátano",
        "sandía", "fresa", "limón", "elefante", "jirafa", "tortuga", "conejo", "dragón", "mono",
        "murciélago", "corazón", "café", "niño", "año", "país", "acción", "lección", "ratón",
        "botón", "melón", "jamón", "balcón", "colibrí", "pingüino", "ornitorrinco", "estornudo",
        "paraguas", "mariposa", "esdrújula", "hiato", "diptongo", "triptongo", "guion", "truhán",
        "vergüenza", "cigüeña", "antigüedad", "bilingüe", "aventura", "misterio", "tesoro", "magia",
        "hechizo", "calabaza", "fantasma", "bruja", "vampiro", "hueso", "calavera", "telaraña",
        "esqueleto", "linterna", "sombra", "susurro", "grito", "risita", "caramelo", "chocolate",
        "galletas", "pastel", "helado", "verano", "invierno", "otoño", "primavera", "nieve",
        "tormenta", "arcoíris", "estrella", "planeta", "universo", "galaxia"
    ],
    en: [
        "apple", "house", "water", "happy", "dream", "smile", "cloud", "river", "forest", "garden",
        "bridge", "window", "pocket", "silver", "golden", "crystal", "diamond", "treasure",
        "journey", "mystery", "puzzle", "secret", "magic", "wizard", "dragon", "castle", "knight",
        "princess", "kingdom", "victory", "freedom", "courage", "honor", "wisdom", "justice",
        "peace", "harmony", "balance", "nature", "universe", "galaxy", "planet", "comet",
        "asteroid", "nebula", "eclipse", "horizon", "infinity", "mountain", "valley", "desert",
        "ocean", "island", "volcano", "rainbow", "sunset", "sunrise", "meadow", "creature",
        "spirit", "ghost", "shadow", "whisper", "laughter", "silence", "melody", "rhythm",
        "symphony", "concert", "festival"
    ]
};

// Modo Experto (6 letras o más)
const hangmanWordsExperto = {
    es: [
        "bicicleta", "elefante", "mariposa", "cocodrilo", "escalera", "ventanal", "biblioteca",
        "calendario", "escritorio", "murciélago", "relámpago", "desierto", "tsunami", "iceberg",
        "cascada", "senderismo", "telescopio", "microscopio", "algoritmo", "servidor", "software",
        "hardware", "batería", "cargador", "auricular", "avestruz", "iguana", "delfín", "sirena",
        "brújula", "esfinge", "cometa", "planeta", "cristal", "diamante", "esmeralda", "zafiro",
        "turquesa", "topacio", "pingüino", "ornitorrinco", "estornudo", "paraguas", "esdrújula",
        "vergüenza", "cigüeña", "antigüedad", "bilingüe", "aventura", "misterio", "tesoro",
        "hechizo", "calabaza", "fantasma", "vampiro", "calavera", "telaraña", "esqueleto",
        "linterna", "sombra", "susurro", "caramelo", "chocolate", "galletas", "pastel", "helado",
        "verano", "invierno", "primavera", "tormenta", "arcoíris", "estrella", "universo",
        "galaxia"
    ],
    en: [
        "mountain", "forest", "garden", "bridge", "window", "pocket", "silver", "golden", "crystal",
        "diamond", "treasure", "adventure", "journey", "mystery", "puzzle", "secret", "wizard",
        "dragon", "castle", "knight", "princess", "kingdom", "victory", "freedom", "courage",
        "wisdom", "justice", "harmony", "balance", "nature", "universe", "galaxy", "planet",
        "asteroid", "nebula", "eclipse", "horizon", "infinity", "valley", "desert", "island",
        "volcano", "rainbow", "sunset", "sunrise", "meadow", "creature", "spirit", "shadow",
        "whisper", "laughter", "silence", "melody", "rhythm", "symphony", "orchestra", "concert",
        "festival", "celebration", "guitar", "violin", "trumpet"
    ]
};

// elige una palabra al azar del banco según idioma actual
function pickSecretWord() {
    const lang = window.getCurrentLang();
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
    const lang = window.getCurrentLang();
    const pool = hangmanWordsExperto[lang];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
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
 /|\  |
      |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 / \  |
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
 /|\  |
      |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
 =========`
];

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
 /|\  |
      |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
 =========`,
    `
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
 =========`
];

// Mensajes al perder en modo Experto: se elige uno al azar, cada uno con su propio enlace.
// Los textos viven en lang/es.js y lang/en.js (claves loseN_text, loseN_cancel, loseN_accept)
const loseMessages = [
    {
         textKey: "lose1_text",
         cancelKey: "lose1_cancel",
         acceptKey: "lose1_accept",
         url: "https://github.com/YonaZakkart"
    },
    {
         textKey: "lose2_text",
         cancelKey: "lose2_cancel",
         acceptKey: "lose2_accept",
         url: "https://github.com/YonaZakkart/yoro"
    },
    {
         textKey: "lose3_text",
         cancelKey: "lose3_cancel",
         acceptKey: "lose3_accept",
         url: "https://github.com/YonaZakkart/yoro"
    }
];

// Regex dinámico según idioma: ES acepta tildes y ñ, EN solo a-z
function getLetterRegex() {
    const lang = window.getCurrentLang();
    return lang === "en" ? /^[a-z]+$/i : /^[a-záéíóúüñ]+$/i;
}