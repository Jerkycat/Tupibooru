// Minimizar Sidebar
document.addEventListener('click', (event) => {
    const minimizeButton = event.target.closest('.aside-title .minimize');
    if (!minimizeButton) return;
    
    console.log("Botão de Minimizar Clicado!", minimizeButton);
    
    const sideTitleDiv = minimizeButton.parentElement;
    
    let sideContentDiv = sideTitleDiv.nextElementSibling;
    while (sideContentDiv && !sideContentDiv.classList.contains('aside-content')) {
        sideContentDiv = sideContentDiv.nextElementSibling;
    }
    if (sideContentDiv) {
        console.log("Conteúdo encontrado. Trocando classe.");
        sideContentDiv.classList.toggle('collapsed');
        minimizeButton.classList.toggle('collapsed');
    } else {
        console.error("ERRO: O elemento .aside-content irmão não foi encontrado.");
    }
});

// Minimizar Board Posts
document.addEventListener('DOMContentLoaded', () => {
    const minimizeButtons = document.querySelectorAll('.minimize');

    minimizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('article');
            if (!article) return;

            const parentPostBar = button.closest('.section-bar');
            if (!parentPostBar) return;

            let nextElement = parentPostBar.nextElementSibling;
            while (nextElement) {
                if (nextElement.tagName === 'SECTION') {
                    if (nextElement.style.display === 'none') {
                        nextElement.style.display = '';
                    } else {
                        nextElement.style.display = 'none';
                    }
                }
                nextElement = nextElement.nextElementSibling;
            }

            const icon = button.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.toggle('rotated');
            }
        });
    });
});