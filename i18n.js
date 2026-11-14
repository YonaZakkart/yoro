// Sistema de idiomas de Yoro: guarda el idioma elegido y entrega cada texto por su clave.

const LANG_STORAGE_KEY = "yoro_lang";
const supportedLangs = ["es", "en"];

// un diccionario por idioma (vienen de lang/es.js y lang/en.js, que se cargan antes que este archivo)
const dictionaries = { es: lang_es, en: lang_en };

// lee el idioma guardado; si no hay (o no es válido), detecta del navegador; si no es es/en, usa inglés
function loadLang() {
    try {
        const saved = localStorage.getItem(LANG_STORAGE_KEY);
        if (supportedLangs.includes(saved)) return saved;
        const browserLang = navigator.language?.split('-')[0].toLowerCase();
        if (supportedLangs.includes(browserLang)) return browserLang;
        return "en";
    } catch (error) {
        return "en";
    }
}

let currentLang = loadLang();

// expone el idioma actual para que main.js pueda leerlo
function getCurrentLang() { return currentLang; }

// cambia el idioma activo y lo guarda para la próxima visita
function setLang(lang) {
    if (!supportedLangs.includes(lang)) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    applyTranslations();
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

// texto con singular y plural: busca clave_one cuando count vale 1, y clave_other en cualquier otro caso.
// {count} queda disponible en el texto: tp("res_top", 3) rellena {count} con 3
function tp(key, count, params = {}) {
    return t(`${key}_${count === 1 ? "one" : "other"}`, { count, ...params });
}

document.documentElement.lang = currentLang;

// Traduce el texto fijo del HTML: cada elemento con data-i18n="clave" recibe su texto en el idioma activo
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    // título (tooltip) y aria-label juntos, para los botones que solo tienen un ícono
    document.querySelectorAll("[data-i18n-title]").forEach(element => {
        const text = t(element.dataset.i18nTitle);
        element.title = text;
        element.setAttribute("aria-label", text);
    });
}

applyTranslations();