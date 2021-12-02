var children = [
    'Miklós',
    'Kornél',
    'Vince',
    'Fruzsi'
];
var commands = [
    '😶 Csukott szájjal egyél!',
    '🥘 Egyél!',
    '🙃 Fordulj előre!',
    '🚶 Gyere vissza!',
    '🍽 Hajolj a tányér fölé!',
    '😴 Kelj fel az asztalról!',
    '🔇 Maradj csöndben!',
    '🛑 Ne csináld már!',
    '📢 Ne kiabálj!',
    '🤏 Ne piszkáld a testvéred!',
    '🍞 Nem repül a kenyér!',
    '🥤 Tedd le a poharat!',
    '🦶 Tedd le a lábad!',
    '🪑 Ülj le!'
];

function speak(text) {
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = preferredLanguage();
    window.speechSynthesis.speak(utter);
}

function fetchData(key) {
    var stored = window.localStorage.getItem(`dinnercommander/${key}`);
    return stored && JSON.parse(stored);
}

function storeData(key, value) {
    window.localStorage.setItem(`dinnercommander/${key}`,
                                JSON.stringify(value));
}

function populateButtons() {
    var labels = children.map(
        name => `<label><input type="radio" name="child" ` +
            `value="${name}"><span>${name}</span></label>`
    ).join('');
    document.getElementById('labels').innerHTML = labels;
    document.querySelector('#labels input').checked = true;

    var buttons = commands.map(cmd => `<button>${cmd}</button>`).join('');
    document.getElementById('buttons').innerHTML = buttons;
    document.querySelectorAll('#buttons button').forEach(
        function (btn) {
            var command = btn.innerText.
                replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
            btn.addEventListener('click', function () {
                var child =
                    document.querySelector('#labels input:checked').value;
                speak(child + ', ' + command);
            });
        }
    );
}

function configure() {
    labelsEditor.value = children.join(' ');
    buttonsEditor.value = commands.join('\n');
    configWindow.style.visibility = 'visible';
}

function cancelConfig() {
    configWindow.style.visibility = 'hidden';
}

function acceptConfig() {
    var lang = languageSelector.selectedOptions[0].value;
    children = labelsEditor.value.trim().split(/\s+/);
    commands = buttonsEditor.value.split('\n').
        map(s => s.trim()).filter(s => s != '');
    storeData('lang', lang);
    storeData('children', children);
    storeData('commands', commands);
    configWindow.style.visibility = 'hidden';
    translatePage();
    populateButtons();
}

function help() {
    window.location = `${translate('readme')}.html`;
}

document.addEventListener('DOMContentLoaded', function() {
    configWindow = document.getElementById('config');
    languageSelector = document.getElementById('lang');
    labelsEditor = document.getElementById('labels-editor');
    buttonsEditor = document.getElementById('buttons-editor');
    children = fetchData('children') || children;
    commands = fetchData('commands') || commands;

    translatePage();
    populateButtons();
});
