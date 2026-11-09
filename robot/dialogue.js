// Inicio: Evento 1
const introDialogue = [
    { key: "e1_intro_1", pause: 1200 },
    { key: "e1_intro_2", pause: 2400 },
    { key: "e1_intro_3", pause: 1800 },
    { key: "e1_intro_4", pause: 2400 },
    { key: "e1_intro_5", pause: 1200 },
    { key: "e1_intro_6", pause: 2200 },
    { key: "e1_intro_7", pause: 2600 },
    { key: "e1_intro_8", pause: 1600 }
];

const outroDialogue = [
    { key: "e1_outro_1", pause: 2000 },
    { key: "e1_outro_2", pause: 2400 },
    { key: "e1_outro_3", pause: 1800 },
    { key: "e1_outro_4", pause: 1400 }
];

// mensaje de regreso a la pagina
const returningDialogue = [
    { key: "returning_1", pause: 1600 },
    { key: "returning_2", pause: 1800 }
];

const confirmYesDialogue = [
    { key: "e1_yes_1", pause: 1800 },
    { key: "e1_yes_2", pause: 1200 }
];

const confirmNoDialogue = [
    { key: "e1_no_1", pause: 1600 },
    { key: "e1_no_2", pause: 1800 }
];

//Evento 2
// Juego 1.1: Adivina el número con pistas
const introDialogue2 = [
    { key: "e2_intro_1", pause: 800 },
    { key: "e2_intro_2", pause: 2000 },
    { key: "e2_intro_3", pause: 2200 },
    { key: "e2_intro_4", pause: 2200 },
    { key: "e2_intro_5", pause: 2400 }
];

const outroDialogue2 = [
    { key: "e2_outro_1", pause: 2000 },
    { key: "e2_outro_2", pause: 1800 }
];

const replayAcceptDialogue2 = [
    { key: "e2_accept_1", pause: 1800 },
    { key: "e2_accept_2", pause: 1200 }
];

const replayDeclineDialogue2 = [
    { key: "e2_decline_1", pause: 1600 },
    { key: "e2_decline_2", pause: 2000 },
    { key: "e2_decline_3", pause: 2000 }
];

//Evento 3
// Agregar nombre de usuario
const introDialogue3 = [
    { key: "e3_intro_1", pause: 1800 },
    { key: "e3_intro_2", pause: 2000 },
    { key: "e3_intro_3", pause: 1800 }
];

const nameDialogue3 = [
    { key: "e3_name_1", pause: 1600 },
    { key: "e3_name_2", pause: 1800 },
    { key: "e3_name_3", pause: 2200 },
    { key: "e3_name_4", pause: 2800 },
    { key: "e3_name_5", pause: 2400 }
];

//Evento 4
// Juego 1.2: Adivina el número con modos Casual y Desafío
const introDialogue4 = [
    { key: "e4_intro_1", pause: 1800 },
    { key: "e4_intro_2", pause: 1400 },
    { key: "e4_intro_3", pause: 2800 }
];

const outroDialogue4 = [
    { key: "e4_outro_1", pause: 1800 },
    { key: "e4_outro_2", pause: 2800 },
    { key: "e4_outro_3", pause: 1800 }
];

const replayAcceptDialogue4 = [
    { key: "e4_accept_1", pause: 1800 },
    { key: "e4_accept_2", pause: 1200 }
];

const replayDeclineDialogue4 = [
    { key: "e4_decline_1", pause: 1600 },
    { key: "e4_decline_2", pause: 2000 }
];

//Evento 5
// Juego: Cuenta Conmigo (suma y resta)
function buildIntroDialogue5() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `Oye ${name}...`, pause: 1600 },
        { text: "Hice algo nuevo esta vez", pause: 2000 },
        { text: "Se llama \"Cuenta Conmigo\"", pause: 1800 },
        { text: "Son sumas y restas, nada complicado", pause: 2200 },
        { text: "Vamos a resolver solo 5 ejercicios", pause: 2400 }
    ];
}

function buildOutroDialogue5() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Qué tal estuvo, ${name}?`, pause: 1800 },
        { text: "Creo que las matemáticas no son tan difíciles", pause: 2200 },
        { text: "Seguiré practicando...", pause: 1800 }
    ];
}

const replayAcceptDialogue5 = [
    { text: "Bien, vamos de nuevo", pause: 1600 },
    { text: "¡Suerte!", pause: 1200 }
];

const replayDeclineDialogue5 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré practicando por mi cuenta", pause: 2000 }
];

//Evento 6
// Cuenta Conmigo 1.1: modos Casual e Infinito
function buildIntroDialogue6() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `${name}, mejoré "Cuenta Conmigo" jeje`, pause: 2000 },
        { text: "Ahora tiene dos modos distintos", pause: 2000 },
        { text: "Elige el que prefieras", pause: 1800 }
    ];
}

function buildOutroDialogue6() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Cómo te fue, ${name}?`, pause: 1800 },
        { text: "Ahora intentaré crear un nuevo juego", pause: 2200 },
        { text: "Ya no será sobre números jeje", pause: 2200 },
        { text: "Regresa pronto...", pause: 1800 }
    ];
}

const replayAcceptDialogue6 = [
    { text: "Bien, elige un modo de nuevo", pause: 1800 },
    { text: "¡Suerte!", pause: 1200 }
];

const replayDeclineDialogue6 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré practicando por mi cuenta", pause: 2000 }
];

//Sistema: preguntar si el jugador quiere seguir jugando (tras repetir un juego desde el menu)
const askContinueDialogue = [
    { key: "sys_continue_1", pause: 1800 },
    { key: "sys_continue_2", pause: 1800 }
];

const replayOutroDialogue = [
    { key: "sys_replay_outro_1", pause: 1500 }
];

const continueLaterDialogue = [
    { key: "sys_continue_later_1", pause: 1800 }
];

//Evento 7
// Juego: Ahorcado (version base)
function buildIntroDialogue7() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `${name}, tengo un juego nuevo`, pause: 1800 },
        { text: "Se llama \"Ahorcado\"", pause: 1800 },
        { text: "Pensé en una palabra secreta...", pause: 2000 },
        { text: "Debes adivinarla letra por letra", pause: 2200 },
        { text: "O intentar la palabra completa si crees saberla", pause: 2400 }
    ];
}

function buildOutroDialogue7() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Qué te pareció, ${name}?`, pause: 1800 },
        { text: "Ya no era solo sobre números jeje", pause: 2000 },
        { text: "Regresa pronto...", pause: 1800 }
    ];
}

const replayAcceptDialogue7 = [
    { text: "Bien, pensaré en otra palabra", pause: 1800 },
    { text: "¡Suerte!", pause: 1200 }
];

const replayDeclineDialogue7 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré pensando en algo nuevo", pause: 2000 }
];

//Evento 8
// Ahorcado 1.1: modos Casual y Desafio
function buildIntroDialogue8() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `${name}, mejoré el Ahorcado`, pause: 1800 },
        { text: "Ahora hay dos modos distintos", pause: 2000 },
        { text: "Y ya no tienes intentos infinitos jeje", pause: 2200 },
        { text: "Elige el que prefieras", pause: 1800 }
    ];
}

function buildOutroDialogue8() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Cómo te fue, ${name}?`, pause: 1800 },
        { text: "Los intentos limitados le dan más emoción, ¿no crees?", pause: 2400 },
        { text: "Regresa pronto :p", pause: 1800 }
    ];
}

const replayAcceptDialogue8 = [
    { text: "Bien, elige un modo de nuevo", pause: 1800 },
    { text: "¡Suerte!", pause: 1200 }
];

const replayDeclineDialogue8 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré pensando en más mejoras", pause: 2000 }
];

//Evento 9
// Ahorcado 1.2: se agrega el modo Experto
function buildIntroDialogue9() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `${name}, agregué un modo más al Ahorcado`, pause: 1800 },
        { text: "Se llama \"Experto\"", pause: 1600 },
        { text: "Las palabras son más largas y solo tienes 10 intentos", pause: 2400 },
        { text: "Puedes usar Pistas pero restan intentos", pause: 2400 },
        { text: "Elige el modo que prefieras", pause: 1800 }
    ];
}

function buildOutroDialogue9() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Qué tal, ${name}?`, pause: 1800 },
        { text: "El modo Experto es bastante difícil, ¿no crees?", pause: 2200 },
        { text: "Regresa pronto...", pause: 1800 }
    ];
}

const replayAcceptDialogue9 = [
    { text: "Bien, elige un modo de nuevo", pause: 1800 },
    { text: "¡Suerte!", pause: 1200 }
];

const replayDeclineDialogue9 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré pensando en más mejoras", pause: 2000 }
];