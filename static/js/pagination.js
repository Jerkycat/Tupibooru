// Adicione este script ao seu arquivo JS

class SimplePaginator {
    constructor(containerId, totalPages = 20) {
        this.container = document.querySelector(containerId);
        this.totalPages = totalPages;
        this.currentPage = 1;
        
        this.render();
    }
    
    getVisiblePages() {
        const pages = [];
        const current = this.currentPage;
        const total = this.totalPages;
        
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (current <= 3) {
                pages.push(2, 3, 4, 5);
                pages.push('separator');
                pages.push(total);
            } else if (current >= total - 2) {
                pages.push('separator');
                pages.push(total - 4, total - 3, total - 2, total - 1, total);
            } else {
                pages.push('separator');
                pages.push(current - 1, current, current + 1);
                pages.push('separator');
                pages.push(total);
            }
        }
        
        return pages;
    }
    
    render() {
        const pages = this.getVisiblePages();
        this.container.innerHTML = '';
        
        pages.forEach(page => {
            if (page === 'separator') {
                const separator = document.createElement('span');
                separator.className = 'pagination-separator';
                separator.textContent = '—';
                this.container.appendChild(separator);
            } else {
                const btn = document.createElement('button');
                btn.className = 'default-button';
                btn.textContent = page;
                
                if (page === this.currentPage) {
                    btn.classList.add('button-active');
                }
                
                btn.addEventListener('click', () => this.goToPage(page));
                this.container.appendChild(btn);
            }
        });
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        this.render();
        
        // Aqui você pode adicionar lógica para carregar conteúdo
        console.log(`Página ${page}`);
        
        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const paginator = new SimplePaginator('.pagination', 20);
});