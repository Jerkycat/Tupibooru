
function closeModal(dialogElement) {
    // Se o dialog não existe ou já está fechando, não faz nada.
    // Isso evita bugs de múltiplos cliques.
    if (!dialogElement || dialogElement.classList.contains('closing')) return;

    dialogElement.classList.add('closing');

    dialogElement.addEventListener('animationend', () => {
        dialogElement.classList.remove('closing');
        dialogElement.close();
    }, { once: true });
}

const triggerClasses = ['delete', 'pin', 'lock', 'warn', 'ban', 'move', 'block', 'report', 'moderate', 'post', 'review', 'avatar', 'trust'];

document.addEventListener('click', function (event) {
    const triggerSelector = triggerClasses.map(cls => '.' + cls).join(', ');
    const clickedTrigger = event.target.closest(triggerSelector);

    if (clickedTrigger) {
        event.preventDefault();

        let dialogClass = null;
        for (const cls of triggerClasses) {
            if (clickedTrigger.classList.contains(cls)) {
                dialogClass = 'popup-' + cls;
                break;
            }
        }

        if (dialogClass) {
            const dialog = document.querySelector('.' + dialogClass);
            if (dialog) {
                dialog.showModal();
            } else {
                console.error('Erro: Dialog com a classe "' + dialogClass + '" não encontrada.');
            }
        }
    }
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-button')) {
        const dialogToClose = event.target.closest('dialog');
        if (dialogToClose) {
            closeModal(dialogToClose);
        }
    }
});

document.addEventListener('click', function (event) {
    // Verifica se o elemento clicado é um <dialog> que está aberto.
    // Clicar no backdrop de um <dialog> nativo faz com que o próprio
    // dialog seja o 'event.target'.
    if (event.target.tagName === 'DIALOG') {
        closeModal(event.target);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const popupDialog = document.querySelector('.popup-image');
    if (!popupDialog) {
        return;
    }

    const popupImage = popupDialog.querySelector('.popup-image-img');
    const imagesToOpenDialog = document.querySelectorAll('.media-wrapper img:not(.spoiler-overlay)');

    imagesToOpenDialog.forEach(img => {
        img.addEventListener('click', () => {
            if (popupImage && popupDialog) {
                popupImage.src = img.src;
                popupDialog.showModal();
            }
        });
    });
});