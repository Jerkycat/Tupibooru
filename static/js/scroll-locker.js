document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Função para verificar se algum dialog está aberto
    const isAnyDialogOpen = () => {
        return document.querySelectorAll('dialog[open]').length > 0;
    };

    // Função para atualizar o bloqueio de scroll
    const updateScrollLock = () => {
        if (isAnyDialogOpen()) {
            body.classList.add('scroll-locked');
        } else {
            body.classList.remove('scroll-locked');
        }
    };

    // Observador de mutações para detectar a abertura e fechamento de dialogs
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
                updateScrollLock();
            }
        }
    });

    // Inicia a observação no body para capturar alterações em todos os dialogs
    observer.observe(body, {
        attributes: true,
        subtree: true
    });

    // Lógica para os botões de exemplo
    const openDialog1 = document.getElementById('openDialog1');
    const closeDialog1 = document.getElementById('closeDialog1');
    const dialog1 = document.getElementById('dialog1');

    const openDialog2 = document.getElementById('openDialog2');
    const closeDialog2 = document.getElementById('closeDialog2');
    const dialog2 = document.getElementById('dialog2');

    openDialog1.addEventListener('click', () => {
        dialog1.showModal();
    });

    closeDialog1.addEventListener('click', () => {
        dialog1.close();
    });

    openDialog2.addEventListener('click', () => {
        dialog2.showModal();
    });

    closeDialog2.addEventListener('click', () => {
        dialog2.close();
    });
});