document.addEventListener('DOMContentLoaded', function () {
    const pagination = document.querySelector('.pagination');
    const totalPages = 20;
    let currentPage = 1;
    let visiblePages = [1, 2, 20]; // Páginas inicialmente visíveis

    // Função para atualizar a exibição da paginação
    function updatePagination() {
        pagination.innerHTML = '';

        // Sempre mostra a página 1
        const page1 = createPageButton(1);
        if (currentPage === 1) {
            page1.classList.add('button-active');
        }
        pagination.appendChild(page1);

        // Lógica para as páginas intermediárias
        if (currentPage <= 4) {
            // Mostra páginas 2-5 quando currentPage <= 4
            for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
                pagination.appendChild(createPageButton(i));
            }
            if (totalPages > 6) {
                pagination.appendChild(createDivider());
            }
        } else if (currentPage >= totalPages - 3) {
            // Mostra páginas finais quando currentPage está perto do fim
            pagination.appendChild(createDivider());
            for (let i = totalPages - 4; i < totalPages; i++) {
                pagination.appendChild(createPageButton(i));
            }
        } else {
            // Mostra páginas no formato 1 ... current-1, current, current+1 ... last
            pagination.appendChild(createDivider());
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pagination.appendChild(createPageButton(i));
            }
            if (currentPage + 1 < totalPages - 1) {
                pagination.appendChild(createDivider());
            }
        }

        // Sempre mostra a última página
        if (totalPages > 1) {
            const lastPage = createPageButton(totalPages);
            if (currentPage === totalPages) {
                lastPage.classList.add('button-active');
            }
            if (!pagination.innerHTML.includes(lastPage.outerHTML)) {
                pagination.appendChild(lastPage);
            }
        }
    }

    // Função auxiliar para criar botões de página
    function createPageButton(page) {
        const button = document.createElement('a');
        button.href = '#';
        button.className = 'default-button';
        button.textContent = page;
        button.dataset.page = page;

        if (page === currentPage) {
            button.classList.add('button-active');
        }

        button.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            updatePagination();
            // Aqui você pode adicionar a lógica para carregar o conteúdo da página
            console.log(`Página ${currentPage} carregada`);
        });

        return button;
    }

    // Função auxiliar para criar divisórias
    function createDivider() {
        const divider = document.createElement('span');
        divider.className = 'divider';
        divider.textContent = '-';
        return divider;
    }

    // Inicializa a paginação
    updatePagination();
});