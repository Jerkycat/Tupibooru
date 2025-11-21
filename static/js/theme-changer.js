// Configuração dos temas
const themeConfig = {
    'Midnight': null, // Tema padrão (não carrega CSS adicional)
    'Highnoon': '../../static/css/custom/highnoon.css',
    'Minechan': '../../static/css/custom/minechan.css'
};

// Elementos do DOM
const themeButtons = document.querySelectorAll('.dropdown-themes .default-button');
let currentTheme = 'Midnight'; // Tema inicial

// Função para carregar um tema
function loadTheme(themeName) {
    // Remove o tema anterior (se existir)
    const existingTheme = document.getElementById('custom-theme');
    if (existingTheme) {
        existingTheme.remove();
    }

    // Carrega o novo tema (se não for o padrão)
    const themePath = themeConfig[themeName];
    if (themePath) {
        const link = document.createElement('link');
        link.id = 'custom-theme';
        link.rel = 'stylesheet';
        link.href = themePath;
        document.head.appendChild(link);
    }

    // Atualiza o tema atual
    currentTheme = themeName;

    // Salva no localStorage
    localStorage.setItem('selectedTheme', themeName);
}

// Função para atualizar a UI dos botões
function updateThemeButtons(selectedTheme) {
    themeButtons.forEach(button => {
        const buttonText = button.textContent.trim().replace('check_small', '').trim();

        if (buttonText === selectedTheme) {
            button.classList.add('selected-button');
            // Adiciona o ícone de check se não existir
            if (!button.querySelector('.material-symbols-outlined')) {
                const checkIcon = document.createElement('span');
                checkIcon.className = 'material-symbols-outlined';
                checkIcon.textContent = 'check_small';
                button.appendChild(checkIcon);
            }
        } else {
            button.classList.remove('selected-button');
            // Remove o ícone de check
            const checkIcon = button.querySelector('.material-symbols-outlined');
            if (checkIcon) {
                checkIcon.remove();
            }
        }
    });
}

// Event listeners para os botões de tema
themeButtons.forEach(button => {
    button.addEventListener('click', function () {
        const themeName = this.textContent.trim().replace('check_small', '').trim();

        if (themeName !== currentTheme) {
            loadTheme(themeName);
            updateThemeButtons(themeName);
        }
    });
});

// Carregar tema salvo ao iniciar a página
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        loadTheme(savedTheme);
        updateThemeButtons(savedTheme);
    }
});