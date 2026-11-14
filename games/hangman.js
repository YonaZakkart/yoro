// Banco de palabras para el Ahorcado (version base).
// Espanol: con tildes y ñ. Ingles: solo a-z.
const hangmanWords = {
    es: [
        // existentes
        "sol", "mar", "pan", "luz", "rey", "voz", "pie", "oso", "tos", "eje",
        "casa", "perro", "gato", "libro", "mesa", "silla", "puerta", "ventana",
        "flor", "arbol", "nube", "lluvia", "monte", "playa", "rio", "isla",
        "coche", "avion", "barco", "tren", "bicicleta", "camino", "puente",
        "cancion", "musica", "pintura", "letra", "numero", "juego", "robot",
        "pantalla", "teclado", "internet", "programa", "codigo", "pixel",
        "manzana", "naranja", "platano", "sandia", "fresa", "limon",
        "elefante", "jirafa", "tortuga", "conejo", "dragon", "mono",
        // nuevas con tildes y ñ
        "murcielago", "corazon", "cafe", "nino", "ano", "rio", "pais",
        "accion", "cancion", "leccion", "raton", "boton", "melon",
        "jamon", "limon", "dragon", "balcon", "colibri", "pingüino",
        "ornitorrinco", "estornudo", "paraguas", "bicicleta", "mariposa",
        "esdrujula", "hiato", "diptongo", "triptongo", "guion", "truhan",
        "vergüenza", "cigueña", "antiguedad", "bilingue",
        // más palabras 4-12 letras
        "aventura", "misterio", "tesoro", "magia", "hechizo", "calabaza",
        "fantasma", "bruja", "vampiro", "hueso", "calavera", "telaraña",
        "esqueleto", "murcielago", "linterna", "sombra", "susurro", "grito",
        "risita", "caramelo", "chocolate", "galletas", "pastel", "helado",
        "verano", "invierno", "otoño", "primavera", "lluvia", "nieve",
        "tormenta", "arcoiris", "estrella", "planeta", "universo", "galaxia"
    ],
    en: [
        "apple", "house", "water", "happy", "dream", "smile", "cloud",
        "river", "forest", "garden", "bridge", "window", "pocket",
        "silver", "golden", "crystal", "diamond", "treasure", "adventure",
        "journey", "mystery", "puzzle", "secret", "magic", "wizard",
        "dragon", "castle", "knight", "princess", "kingdom", "victory",
        "freedom", "courage", "honor", "wisdom", "justice", "peace",
        "harmony", "balance", "nature", "universe", "galaxy", "planet",
        "comet", "asteroid", "nebula", "eclipse", "horizon", "infinity",
        "mountain", "valley", "desert", "ocean", "island", "volcano",
        "rainbow", "sunset", "sunrise", "meadow", "creature", "spirit",
        "ghost", "shadow", "whisper", "laughter", "silence", "melody",
        "rhythm", "symphony", "orchestra", "concert", "festival", "celebration"
    ]
};

// Banco de palabras para modo Experto (6+ letras)
const hangmanWordsExperto = {
    es: [
        "bicicleta", "elefante", "mariposa", "cocodrilo", "escalera", "ventanal",
        "biblioteca", "calendario", "escritorio", "murcielago", "relampago",
        "desierto", "tsunami", "iceberg", "cascada", "senderismo", "telescopio",
        "microscopio", "algoritmo", "servidor", "software", "hardware", "bateria",
        "cargador", "auricular", "avestruz", "iguana", "delfin", "sirena",
        "brujula", "esfinge", "cometa", "planeta", "cristal", "diamante",
        "esmeralda", "zafiro", "turquesa", "topacio",
        // nuevas con tildes y ñ (6+ letras)
        "pingüino", "ornitorrinco", "estornudo", "paraguas", "mariposa",
        "esdrujula", "vergüenza", "cigueña", "antiguedad", "bilingue",
        "aventura", "misterio", "tesoro", "magia", "hechizo", "calabaza",
        "fantasma", "bruja", "vampiro", "hueso", "calavera", "telaraña",
        "esqueleto", "linterna", "sombra", "susurro", "grito", "caramelo",
        "chocolate", "galletas", "pastel", "helado", "verano", "invierno",
        "otoño", "primavera", "tormenta", "arcoiris", "estrella", "planeta",
        "universo", "galaxia"
    ],
    en: [
        "mountain", "forest", "garden", "bridge", "window", "pocket",
        "silver", "golden", "crystal", "diamond", "treasure", "adventure",
        "journey", "mystery", "puzzle", "secret", "magic", "wizard",
        "dragon", "castle", "knight", "princess", "kingdom", "victory",
        "freedom", "courage", "honor", "wisdom", "justice", "peace",
        "harmony", "balance", "nature", "universe", "galaxy", "planet",
        "comet", "asteroid", "nebula", "eclipse", "horizon", "infinity",
        "valley", "desert", "ocean", "island", "volcano", "rainbow",
        "sunset", "sunrise", "meadow", "creature", "spirit", "ghost",
        "shadow", "whisper", "laughter", "silence", "melody", "rhythm",
        "symphony", "orchestra", "concert", "festival", "celebration",
        "guitar", "piano", "violin", "drums", "flute", "trumpet"
    ]
};

// elige una palabra al azar del banco según idioma actual
function pickSecretWord() {
    const lang = window.getCurrentLang();
    const pool = hangmanWords[lang];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
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