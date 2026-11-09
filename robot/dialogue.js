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
const introDialogue5 = [
    { key: "e5_intro_1", pause: 1600 },
    { key: "e5_intro_2", pause: 2000 },
    { key: "e5_intro_3", pause: 1800 },
    { key: "e5_intro_4", pause: 2200 },
    { key: "e5_intro_5", pause: 2400 }
];

const outroDialogue5 = [
    { key: "e5_outro_1", pause: 1800 },
    { key: "e5_outro_2", pause: 2200 },
    { key: "e5_outro_3", pause: 1800 }
];

const replayAcceptDialogue5 = [
    { key: "e5_accept_1", pause: 1600 },
    { key: "e5_accept_2", pause: 1200 }
];

const replayDeclineDialogue5 = [
    { key: "e5_decline_1", pause: 1600 },
    { key: "e5_decline_2", pause: 2000 }
];

//Evento 6
// Cuenta Conmigo 1.1: modos Casual e Infinito
const introDialogue6 = [
    { key: "e6_intro_1", pause: 2000 },
    { key: "e6_intro_2", pause: 2000 },
    { key: "e6_intro_3", pause: 1800 }
];

const outroDialogue6 = [
    { key: "e6_outro_1", pause: 1800 },
    { key: "e6_outro_2", pause: 2200 },
    { key: "e6_outro_3", pause: 2200 },
    { key: "e6_outro_4", pause: 1800 }
];

const replayAcceptDialogue6 = [
    { key: "e6_accept_1", pause: 1800 },
    { key: "e6_accept_2", pause: 1200 }
];

const replayDeclineDialogue6 = [
    { key: "e6_decline_1", pause: 1600 },
    { key: "e6_decline_2", pause: 2000 }
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
const introDialogue7 = [
    { key: "e7_intro_1", pause: 1800 },
    { key: "e7_intro_2", pause: 1800 },
    { key: "e7_intro_3", pause: 2000 },
    { key: "e7_intro_4", pause: 2200 },
    { key: "e7_intro_5", pause: 2400 }
];

const outroDialogue7 = [
    { key: "e7_outro_1", pause: 1800 },
    { key: "e7_outro_2", pause: 2000 },
    { key: "e7_outro_3", pause: 1800 }
];

const replayAcceptDialogue7 = [
    { key: "e7_accept_1", pause: 1800 },
    { key: "e7_accept_2", pause: 1200 }
];

const replayDeclineDialogue7 = [
    { key: "e7_decline_1", pause: 1600 },
    { key: "e7_decline_2", pause: 2000 }
];

//Evento 8
// Ahorcado 1.1: modos Casual y Desafio
const introDialogue8 = [
    { key: "e8_intro_1", pause: 1800 },
    { key: "e8_intro_2", pause: 2000 },
    { key: "e8_intro_3", pause: 2200 },
    { key: "e8_intro_4", pause: 1800 }
];

const outroDialogue8 = [
    { key: "e8_outro_1", pause: 1800 },
    { key: "e8_outro_2", pause: 2400 },
    { key: "e8_outro_3", pause: 1800 }
];

const replayAcceptDialogue8 = [
    { key: "e8_accept_1", pause: 1800 },
    { key: "e8_accept_2", pause: 1200 }
];

const replayDeclineDialogue8 = [
    { key: "e8_decline_1", pause: 1600 },
    { key: "e8_decline_2", pause: 2000 }
];

//Evento 9
// Ahorcado 1.2: se agrega el modo Experto
const introDialogue9 = [
    { key: "e9_intro_1", pause: 1800 },
    { key: "e9_intro_2", pause: 1600 },
    { key: "e9_intro_3", pause: 2400 },
    { key: "e9_intro_4", pause: 2400 },
    { key: "e9_intro_5", pause: 1800 }
];

const outroDialogue9 = [
    { key: "e9_outro_1", pause: 1800 },
    { key: "e9_outro_2", pause: 2200 },
    { key: "e9_outro_3", pause: 1800 }
];

const replayAcceptDialogue9 = [
    { key: "e9_accept_1", pause: 1800 },
    { key: "e9_accept_2", pause: 1200 }
];

const replayDeclineDialogue9 = [
    { key: "e9_decline_1", pause: 1600 },
    { key: "e9_decline_2", pause: 2000 }
];