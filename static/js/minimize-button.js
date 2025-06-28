// Minimizar Sidebar
document.addEventListener('DOMContentLoaded', (event) => {
    const minimizeButtons = document.querySelectorAll('.side-title .minimize');

    minimizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sideTitleDiv = button.parentElement;

            let sideContentDiv = sideTitleDiv.nextElementSibling;
            while (sideContentDiv && !sideContentDiv.classList.contains('side-content')) {
                sideContentDiv = sideContentDiv.nextElementSibling;
            }

            if (sideContentDiv) {
                sideContentDiv.classList.toggle('collapsed');

                button.classList.toggle('collapsed');
            }
        });
    });
});

// Minimizar Board Posts
document.addEventListener('DOMContentLoaded', () => {
    const minimizeButtons = document.querySelectorAll('.minimize');

    minimizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('article');
            if (!article) return;

            const parentPostBar = button.closest('.post-bar');
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