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
    var supp = document.createElement('optgroup');
    var rest = document.createElement('optgroup');

    pref.label = translate('preferred');
    supp.label = translate('supported');
    rest.label = translate('voice-only');

    var preferred = preferredLanguage();
    langCodes.forEach(function (lang) {
        if (validCodes.has(lang.code)) {
            var opt = new Option(lang.nativeName, lang.code);
            opt.selected = lang.code == preferred;
            var grp = preferredCodes.has(lang.code) ? pref :
                lang.code in translations ? supp : rest;
            grp.appendChild(opt);
        }
    });

    select.textContent = '';
    if (pref.children.length)
        select.appendChild(pref);
    if (supp.children.length)
        select.appendChild(supp);
    if (rest.children.length)
        select.appendChild(rest);
}

function translatePage() {
    populateLanguageSelector(document.getElementById('lang'));
    translateElements();
}

window.speechSynthesis.addEventListener('voiceschanged', function() {
    populateLanguageSelector(document.getElementById('lang'));
})
