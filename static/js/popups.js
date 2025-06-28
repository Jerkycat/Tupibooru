// Revelar/Ocultar Popups
function closeModal(dialogElement) {
    if (dialogElement && dialogElement.close) {
        dialogElement.close();
    }
}

const triggerClasses = ['delete', 'pin', 'lock', 'warn', 'ban', 'block', 'report', 'moderate', 'post', 'review', 'avatar'];

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

// Popup de Imagem
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o dialog usando sua classe. Usamos querySelector para o primeiro que encontrar.
    const popupDialog = document.querySelector('.popup-image');

    // Se o dialog não existir na página, o script para aqui para evitar erros.
    if (!popupDialog) {
        console.warn('Elemento de dialog com a classe "popup-image" não foi encontrado.');
        return;
    }

    // Seleciona o elemento da imagem dentro do dialog
    const popupImage = popupDialog.querySelector('.popup-image-img');

    // Seleciona todas as imagens que devem abrir o popup
    const imagesToOpenDialog = document.querySelectorAll('.media-wrapper img');

    // Adiciona o evento de clique para cada imagem
    imagesToOpenDialog.forEach(img => {
        img.addEventListener('click', () => {
            if (popupImage && popupDialog) {
                popupImage.src = img.src;
                popupDialog.showModal(); // Abre o dialog
            }
        });
    });

    // Evento para fechar o dialog ao clicar no backdrop
    popupDialog.addEventListener('click', (event) => {
        if (event.target === popupDialog) {
            popupDialog.close(); // Fecha o dialog
        }
    });

});