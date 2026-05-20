function closeModal(dialogElement) {
    if (!dialogElement || dialogElement.classList.contains('closing')) return;
    dialogElement.classList.add('closing');
    dialogElement.addEventListener('animationend', () => {
        dialogElement.classList.remove('closing');
        dialogElement.close();
        
        // Remove scroll lock APENAS se não houver mais nenhum dialog aberto
        const openDialogs = document.querySelectorAll('dialog[open]');
        if (openDialogs.length === 0) {
            document.body.classList.remove('scroll-locked');
        }
    }, { once: true });
}

function inicializarPopupImagem() {
    const popupDialog = document.querySelector('.popup-image');
    if (!popupDialog) return;
    
    const popupImage = popupDialog.querySelector('.popup-image-img');
    const imagesToOpenDialog = document.querySelectorAll('.media-wrapper img:not(.spoiler-overlay)');
    
    imagesToOpenDialog.forEach(img => {
        img.addEventListener('click', () => {
            if (popupImage && popupDialog) {
                popupImage.src = img.src;
                popupDialog.showModal();
                
                // Adiciona scroll lock quando abrir
                document.body.classList.add('scroll-locked');
            }
        });
    });
}

function inicializarEventosPopups() {
    const triggerClasses = ['delete', 'pin', 'lock', 'warn', 'ban', 'move', 'block', 'report', 'moderate', 'post', 'review', 'avatar', 'trust', 'manage', 'reviewe1', 'reviewe2', 'noob', 'porn', 'clown', 'dumb'];
    
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
                    
                    // Adiciona scroll lock quando abrir
                    document.body.classList.add('scroll-locked');
                }
            }
        }
    });
    
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('cancel')) {
            const dialogToClose = event.target.closest('dialog');
            if (dialogToClose) {
                closeModal(dialogToClose);
            }
        }
    });
    
    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'DIALOG') {
            closeModal(event.target);
        }
    });
}

// Observa quando elementos são adicionados ao DOM
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            // Verifica se algum popup foi adicionado
            const hasPopup = Array.from(mutation.addedNodes).some(node => 
                node.nodeType === 1 && (node.tagName === 'DIALOG' || node.querySelector('dialog'))
            );
            if (hasPopup) {
                inicializarPopupImagem();
                break;
            }
        }
    }
});

// Inicia observação
observer.observe(document.body, { childList: true, subtree: true });

// Inicializa eventos gerais imediatamente
inicializarEventosPopups();