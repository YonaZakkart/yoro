// Sistema de música de Yoro: un solo reproductor, listas de pistas por contexto,
// fade de volumen entre cambios y botón de la esquina superior.

const MUSIC_VOLUME = 0.4;   // volumen normal (0 a 1)
const MUSIC_FADE_MS = 800;  // duración de los fades al cambiar de pista
const MUSIC_STORAGE_KEY = "yoro_music_enabled"; // "1" = el jugador la tenía activada

// Listas de pistas. "menu" suena en diálogos, menús e idle.
// "games" tiene una lista por gameId y una "default" para los juegos sin pistas propias.
// A futuro basta con agregar entradas, por ejemplo: ahorcado: ["assets/music/otra.mp3"]
const musicTracks = {
    menu: ["assets/music/the_child.mp3"],
    games: {
        default: ["assets/music/eyeless.mp3"]
    }
};

// devuelve la lista de pistas de un juego, o la general si ese juego no tiene propias
function getGameTracks(gameId) {
    return musicTracks.games[gameId] || musicTracks.games.default;
}

const musicPlayer = new Audio();
musicPlayer.volume = 0;

let musicEnabled = false;                 // arranca desactivada (los navegadores bloquean el autoplay)
let currentTrackList = musicTracks.menu;
let currentTrackIndex = 0;
let loadedTrack = null;                   // la pista que el reproductor tiene cargada ahora mismo
let fadeInterval = null;

// sube o baja el volumen poco a poco hasta "target"; onDone se ejecuta al terminar
function fadeVolume(target, duration, onDone) {
    clearInterval(fadeInterval);
    const stepTime = 50;
    const steps = Math.max(1, Math.round(duration / stepTime));
    const delta = (target - musicPlayer.volume) / steps;
    let count = 0;

    fadeInterval = setInterval(() => {
        count++;
        musicPlayer.volume = Math.min(1, Math.max(0, musicPlayer.volume + delta));
        if (count >= steps) {
            clearInterval(fadeInterval);
            musicPlayer.volume = target;
            if (onDone) onDone();
        }
    }, stepTime);
}

// carga la pista actual y la reproduce
function loadAndPlay() {
    loadedTrack = currentTrackList[currentTrackIndex];
    musicPlayer.src = loadedTrack;
    // con una sola pista en la lista, el navegador la repite por su cuenta (loop nativo)
    musicPlayer.loop = currentTrackList.length === 1;
    return musicPlayer.play()
        .then(() => true)
        .catch(error => {
            console.warn("No se pudo reproducir la música:", error);
            return false;
        });
}

// cuando termina una pista (solo pasa si la lista tiene varias), pasa a la siguiente
musicPlayer.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % currentTrackList.length;
    loadAndPlay();
});

// cambia a otra lista de pistas: baja el volumen, cambia, y lo vuelve a subir.
// Si la música está desactivada, solo recuerda la lista para cuando se active.
function switchMusic(list) {
    if (list === currentTrackList) return;
    currentTrackList = list;
    currentTrackIndex = Math.floor(Math.random() * list.length);
    if (!musicEnabled) return;

    fadeVolume(0, MUSIC_FADE_MS, () => {
        loadAndPlay();
        fadeVolume(MUSIC_VOLUME, MUSIC_FADE_MS);
    });
}

function saveMusicPreference(on) {
    try {
        localStorage.setItem(MUSIC_STORAGE_KEY, on ? "1" : "0");
    } catch (error) {
        console.warn("No se pudo guardar la preferencia de música:", error);
    }
}

function setMusicEnabled(on) {
    musicEnabled = on;
    saveMusicPreference(on);
    updateMusicButton();

    if (on) {
        // si la pista cargada ya es la correcta continúa donde estaba; si no, carga la actual
        if (loadedTrack === currentTrackList[currentTrackIndex]) {
            musicPlayer.play().catch(error => console.warn("No se pudo reproducir la música:", error));
        } else {
            loadAndPlay();
        }
        fadeVolume(MUSIC_VOLUME, MUSIC_FADE_MS);
    } else {
        fadeVolume(0, 400, () => musicPlayer.pause());
    }
}

// la música se pausa al salir de la pestaña y continúa al volver
document.addEventListener("visibilitychange", () => {
    if (!musicEnabled) return;
    if (document.hidden) {
        musicPlayer.pause();
    } else {
        musicPlayer.play().catch(() => { });
    }
});

// Botón de música
const musicButton = document.getElementById("music-button");

function updateMusicButton() {
    const icon = musicButton.querySelector(".material-symbols-outlined");
    icon.textContent = musicEnabled ? "music_note" : "music_off";
    musicButton.title = musicEnabled ? "Música (activada)" : "Música (desactivada)";
    musicButton.classList.toggle("music-on", musicEnabled);
    musicButton.classList.toggle("music-attention", !musicEnabled);
}

// stopPropagation por la misma razón que en los otros botones superiores:
// que el click no llegue al listener global de events.js y salte la pausa del diálogo
musicButton.onclick = (clickEvent) => {
    clickEvent.stopPropagation();
    setMusicEnabled(!musicEnabled);
};

// Si el jugador la tenía activada en la visita anterior, intenta retomarla.
// Los navegadores bloquean el audio sin un gesto del usuario, así que si falla,
// espera al primer click o tecla y lo reintenta.
function resumeSavedMusic() {
    if (localStorage.getItem(MUSIC_STORAGE_KEY) !== "1") return;

    musicEnabled = true;
    updateMusicButton();

    function tryStart() {
        if (!musicEnabled) return;
        loadAndPlay().then(started => {
            if (!musicEnabled) {          // la apagó mientras el navegador decidía
                musicPlayer.pause();
                return;
            }
            if (started) {
                fadeVolume(MUSIC_VOLUME, MUSIC_FADE_MS);
            } else {
                waitForGesture();
            }
        });
    }

    function waitForGesture() {
        function handler() {
            document.removeEventListener("click", handler, true);
            document.removeEventListener("keydown", handler, true);
            tryStart();
        }
        // el "true" (fase de captura) hace que se enteren incluso los botones con stopPropagation
        document.addEventListener("click", handler, true);
        document.addEventListener("keydown", handler, true);
    }

    tryStart();
}

updateMusicButton();
resumeSavedMusic();