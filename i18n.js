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

// devuelve el texto de una clave en el idioma activo.
// params rellena los marcadores: t("test_greeting", { name: "Yona" }) cambia {name} por Yona
function t(key, params = {}) {
    // si falta en el idioma activo, cae al español; si falta en ambos, muestra la clave misma
    const text = dictionaries[currentLang][key] ?? dictionaries.es[key] ?? key;

    return text.replace(/\{(\w+)\}/g, (marker, name) =>
        params[name] !== undefined ? params[name] : marker
    );
}

document.documentElement.lang = currentLang;