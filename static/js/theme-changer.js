// Configuração dos temas
const themeConfig = {
    'Midnight': null, // Tema padrão (não carrega CSS adicional)
    'Highnoon': '../../static/css/custom/highnoon.css',
    'Minechan': '../../static/css/custom/minechan.css',
    'Snowfall': '../../static/css/custom/snowfall.css',
    'eXPerience': '../../static/css/custom/experience.css'
};

// Elementos do DOM
const dropdown = document.querySelector('.dropdown.themes');
const themeButtons = dropdown.querySelectorAll('div > button.default-button');
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
        
        // Garante que todos os botões tenham o ícone de check
        let checkIcon = button.querySelector('.material-symbols-outlined');
        if (!checkIcon) {
            checkIcon = document.createElement('span');
            checkIcon.className = 'material-symbols-outlined';
            checkIcon.textContent = 'check_small';
            button.appendChild(checkIcon);
        }
        
        // Controla a visibilidade da checkmark
        if (buttonText === selectedTheme) {
            button.classList.add('selected-theme');
            checkIcon.style.visibility = 'visible';
        } else {
            button.classList.remove('selected-theme');
            checkIcon.style.visibility = 'hidden';
        }
    });
}

// Event listeners para os botões de tema
themeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const themeName = this.textContent.trim().replace('check_small', '').trim();
        
        if (themeName !== currentTheme) {
            loadTheme(themeName);
            updateThemeButtons(themeName);
        }
        
        // Fecha o dropdown após selecionar (opcional)
        dropdown.removeAttribute('tabindex');
        setTimeout(() => dropdown.setAttribute('tabindex', '0'), 100);
    });
});

// Carregar tema salvo ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme');
    
    if (savedTheme && themeConfig.hasOwnProperty(savedTheme)) {
        loadTheme(savedTheme);
        updateThemeButtons(savedTheme);
    } else {
        // Garante que o tema padrão esteja marcado
        updateThemeButtons(currentTheme);
    }
});

// Previne que cliques nos botões fechem o dropdown prematuramente
dropdown.addEventListener('click', function(e) {
    if (e.target.closest('button.default-button')) {
        e.stopPropagation();
    }
});