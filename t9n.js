function primaryLanguage(tag) {
    return tag.split(/[-_]/)[0];
}

function preferredLanguage() {
    return fetchData('lang') || primaryLanguage(navigator.language);
}

function translate(text) {
    var t9n = translations[preferredLanguage()];
    return (t9n && t9n[text]) || translations['en'][text] || text;
}

function translateElements() {
    var lang = preferredLanguage();
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('*[data-t9n]').forEach(function (elt) {
        elt.innerText = translate(elt.dataset.t9n, lang);
    });
}

function populateLanguageSelector(select) {
    var voices = window.speechSynthesis.getVoices();
    if (!select || !voices)
        return;

    var validCodes = new Set(voices.map(voice => primaryLanguage(voice.lang)));
    var preferredCodes = new Set(navigator.languages.map(primaryLanguage));
    var pref = document.createElement('optgroup');
    var rest = document.createElement('optgroup');

    pref.label = translate('preferred');
    rest.label = translate('others');

    var preferred = preferredLanguage();
    langCodes.forEach(function (lang) {
        if (validCodes.has(lang.code)) {
            var opt = new Option(lang.nativeName, lang.code);
            opt.selected = lang.code == preferred;
            (preferredCodes.has(lang.code) ? pref : rest).appendChild(opt);
        }
    });

    select.textContent = '';
    select.appendChild(pref);
    select.appendChild(rest);
}

function translatePage() {
    populateLanguageSelector(document.getElementById('lang'));
    translateElements();
}

window.speechSynthesis.addEventListener('voiceschanged', function() {
    populateLanguageSelector(document.getElementById('lang'));
})
