// Inicio: Evento 1
const introDialogue = [
    { text: "Oh....", pause: 1200 },
    { text: "No esperaba que alguien entrara...", pause: 2400 },
    { text: "Hola, me llamo Yoro", pause: 1800 },
    { text: "Estoy intentando hacer un juego...", pause: 2400 },
    { text: "uhm...", pause: 1200 },
    { text: "¿Quieres jugar 'Adivina el número'?", pause: 2200 },
    { text: "Debes adivinar el numero que estoy pensado", pause: 2600 },
    { text: "Esta entre 1 y 10", pause: 1600 }
];

const outroDialogue = [
    { text: "Fue divertido jeje", pause: 2000 },
    { text: "Gracias por jugar conmigo", pause: 2400 },
    { text: "Intentare mejorar el juego", pause: 1800 },
    { text: "Espero regreses...", pause: 1400 }
];

// mensaje de regreso a la pagina
const returningDialogue = [
    { text: "Volviste!", pause: 1600 },
    { text: "¿Qué quieres jugar?", pause: 1800 },
];

const confirmYesDialogue = [
    { text: "Bien, ya sabes cómo va, ¿no?", pause: 1800 },
    { text: "¡Buena suerte!", pause: 1200 }
];

const confirmNoDialogue = [
    { text: "Oh... está bien", pause: 1600 },
    { text: "Seguiré trabajando", pause: 1800 }
];

//Evento 2
// Juego 1.1: Adivina el número con pistas
const introDialogue2 = [
    { text: "Si volviste...", pause: 800 },
    { text: "He mejorado un poco...", pause: 2000 },
    { text: "Ahora te daré pistas si fallas", pause: 2200 },
    { text: "¿Jugamos \"Adivina el número 1.1\"?", pause: 2200 },
    { text: "Ah, si. Ahora el número esta entre 1 y 20!", pause: 2400 },
];

const outroDialogue2 = [
    { text: "Seguiré mejorando el juego", pause: 2000 },
    { text: "Regresa pronto...", pause: 1800 }
];

const replayAcceptDialogue2 = [
    { text: "Bien, ya sabes cómo va, ¿no?", pause: 1800 },
    { text: "¡Vamos!", pause: 1200 }
];

const replayDeclineDialogue2 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré mejorando el juego", pause: 2000 },
    { text: "Espero puedas jugar la próxima vez", pause: 2000 }
];

//Evento 3
// Agregar nombre de usuario
const introDialogue3 = [
    { text: "Hola, bienvenido de vuelta...", pause: 1800 },
    { text: "Ah... cierto, aún no sé tu nombre", pause: 2000 },
    { text: "¿Puedo saber tu nombre?", pause: 1800 }
];

function buildNameDialogue(name) {
    return [
        { text: `${name}...`, pause: 1600 },
        { text: "Me gusta tu nombre", pause: 1800 },
        { text: `Gracias por acompañarme, ${name}...`, pause: 2200 },
        { text: `Aún sigo mejorando el juego, no hay nada nuevo por ahora`, pause: 2800 },
        { text: "Trataré de hacer un mejor juego para ti", pause: 2400 }
    ];
}
//Evento 4
// Juego 1.2: Adivina el número con modos Casual y Desafío
// function buildIntroDialogue4() {
//     const name = localStorage.getItem("yoro_player_name");
//     return [
//         { text: `Hola ${name}!`, pause: 2400 },
//         { text: "He mejorado un poco el juego...", pause: 2000 },
//         { text: "Ahora el número está entre 1 y 50", pause: 2000 }
//     ];
// };

function buildIntroDialogue4() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `Bienvenido de vuelta, ${name}`, pause: 1800 },
        { text: `He mejorado el juego`, pause: 1400 },
        { text: "Ahora hay 2 modos de juego y el número está entre 1 y 50", pause: 2800 }
    ];
}

function buildOutroDialogue4() {
    const name = localStorage.getItem("yoro_player_name");
    return [
        { text: `¿Que te pareció, ${name}?`, pause: 1800 },
        { text: `Ahora intentaré crear un nuevo juego`, pause: 2800 },
        { text: "Regresa pronto...", pause: 1800 }
    ];
}

const replayAcceptDialogue4 = [
    { text: "Bien, ya sabes cómo va, ¿no?", pause: 1800 },
    { text: "¡Vamos!", pause: 1200 }
];

const replayDeclineDialogue4 = [
    { text: "Ohh... está bien", pause: 1600 },
    { text: "Seguiré mejorando el juego", pause: 2000 }
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