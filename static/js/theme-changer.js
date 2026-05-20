// Configuração dos temas
// Aceita string (só CSS) ou objeto { css, js } (CSS + JS)
const themeConfig = {
    'Midnight': null,
    'Highnoon':   '../../static/css/custom/highnoon.css',
    'Minechan':   '../../static/css/custom/minechan.css',
    'Snowfall':   '../../static/css/custom/snowfall.css',
    'eXPerience': '../../static/css/custom/experience.css',
    'Balatro': {
        css: '../../static/css/custom/balatro.css',
        js:  '../../static/js/custom/balatro.js'
    }
};

// Elementos do DOM
const dropdown = document.querySelector('.dropdown.themes');
const themeButtons = dropdown.querySelectorAll('div > button.default-button');
let currentTheme = 'Midnight';

// Remove o tema atual (CSS + JS)
function unloadCurrentTheme() {
    // Chama a função de cleanup do tema JS anterior (se existir)
    if (typeof window.__themeCleanup === 'function') {
        window.__themeCleanup();
        window.__themeCleanup = null;
    }

    const existingCSS = document.getElementById('custom-theme');
    if (existingCSS) existingCSS.remove();

    const existingJS = document.getElementById('custom-theme-js');
    if (existingJS) existingJS.remove();
}

// Carrega um tema
function loadTheme(themeName) {
    unloadCurrentTheme();

    const themeData = themeConfig[themeName];

    if (themeData) {
        const cssPath = typeof themeData === 'string' ? themeData : themeData.css;
        const jsPath  = typeof themeData === 'object' && themeData.js ? themeData.js : null;

        if (cssPath) {
            const link = document.createElement('link');
            link.id   = 'custom-theme';
            link.rel  = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }

        if (jsPath) {
            const script = document.createElement('script');
            script.id  = 'custom-theme-js';
            script.src = jsPath;
            document.body.appendChild(script);
        }
    }

    currentTheme = themeName;
    localStorage.setItem('selectedTheme', themeName);
}

// Atualiza a UI dos botões
function updateThemeButtons(selectedTheme) {
    themeButtons.forEach(button => {
        const buttonText = button.textContent.trim().replace('check_small', '').trim();

        let checkIcon = button.querySelector('.material-symbols-outlined');
        if (!checkIcon) {
            checkIcon = document.createElement('span');
            checkIcon.className   = 'material-symbols-outlined';
            checkIcon.textContent = 'check_small';
            button.appendChild(checkIcon);
        }

        if (buttonText === selectedTheme) {
            button.classList.add('selected-theme');
            checkIcon.style.visibility = 'visible';
        } else {
            button.classList.remove('selected-theme');
            checkIcon.style.visibility = 'hidden';
        }
    });
}

// Event listeners dos botões
themeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const themeName = this.textContent.trim().replace('check_small', '').trim();

        if (themeName !== currentTheme) {
            loadTheme(themeName);
            updateThemeButtons(themeName);
        }

        dropdown.removeAttribute('tabindex');
        setTimeout(() => dropdown.setAttribute('tabindex', '0'), 100);
    });
});

// Carrega tema salvo ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme');

    if (savedTheme && themeConfig.hasOwnProperty(savedTheme)) {
        loadTheme(savedTheme);
        updateThemeButtons(savedTheme);
    } else {
        updateThemeButtons(currentTheme);
    }
});

// Evita fechar o dropdown ao clicar nos botões
dropdown.addEventListener('click', function(e) {
    if (e.target.closest('button.default-button')) {
        e.stopPropagation();
    }
});