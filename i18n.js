// Sistema de idiomas de Yoro: guarda el idioma elegido y entrega cada texto por su clave.

const LANG_STORAGE_KEY = "yoro_lang";
const supportedLangs = ["es", "en"];

// un diccionario por idioma (vienen de lang/es.js y lang/en.js, que se cargan antes que este archivo)
const dictionaries = { es: lang_es, en: lang_en };

// lee el idioma guardado; si no hay (o no es válido), usa español
function loadLang() {
    try {
        const saved = localStorage.getItem(LANG_STORAGE_KEY);
        return supportedLangs.includes(saved) ? saved : "es";
    } catch (error) {
        return "es";
    }
}

let currentLang = loadLang();

// cambia el idioma activo y lo guarda para la próxima visita
function setLang(lang) {
    if (!supportedLangs.includes(lang)) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (error) {
        console.warn("No se pudo guardar el idioma:", error);
    }
}

// el nombre del jugador, para rellenar {name} automáticamente en cualquier texto
function getPlayerName() {
    try {
        return localStorage.getItem("yoro_player_name") || "";
    } catch (error) {
        return "";
    }
}

function t(key, params = {}) {
    const text = dictionaries[currentLang][key] ?? dictionaries.es[key] ?? key;
    // {name} siempre está disponible; si se pasa otro valor en params, ese tiene prioridad
    const values = { name: getPlayerName(), ...params };

    return text.replace(/\{(\w+)\}/g, (marker, name) =>
        values[name] !== undefined ? values[name] : marker
    );
}

document.documentElement.lang = currentLang;