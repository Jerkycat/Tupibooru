document.addEventListener('DOMContentLoaded', (event) => {
    // Switch between tabs
    const options = document.querySelectorAll('.popup-manage-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            options.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');

            // Hide all tabs
            document.querySelectorAll('.popup-manage-tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Show selected tab
            const tabName = option.getAttribute('data-option');
            document.querySelector(`.popup-manage-tab[data-tab="${tabName}"]`).classList.add('active');
        });
    });

    // Add moderator functionality
    document.querySelectorAll('.add-moderator').forEach(button => {
        button.addEventListener('click', function () {
            // Agora precisamos subir até o side-content e então encontrar o input
            const sideContent = this.closest('.side-content');
            const input = sideContent.querySelector('.add-moderator-input');
            const moderatorName = input.value.trim();

            if (moderatorName) {
                const moderatorList = sideContent.querySelector('.moderator-list');

                const moderatorItem = document.createElement('div');
                moderatorItem.className = 'moderator-item';
                moderatorItem.innerHTML = `
                <span>${moderatorName}</span>
                <button type="button" class="remove-moderator">X</button>
            `;

                moderatorList.appendChild(moderatorItem);
                input.value = '';

                // Add event listener to the new remove button
                moderatorItem.querySelector('.remove-moderator').addEventListener('click', function () {
                    this.closest('.moderator-item').remove();
                });
            }
        });
    });

    // Remove moderator functionality
    document.querySelectorAll('.remove-moderator').forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.moderator-item').remove();
        });
    });

    // Seleciona TODOS os botões CAPTCHA da página
    document.querySelectorAll('.add-captcha').forEach(button => {
        button.addEventListener('click', function () {
            // Alterna a classe 'active' apenas neste botão específico
            this.classList.toggle('button-active');

            // Altera texto e cor APENAS para este botão
            if (this.classList.contains('button-active')) {
                this.textContent = 'Desativar CAPTCHA';
                this.style.backgroundColor = 'var(--ui-c3)'; // Vermelho
            } else {
                this.textContent = 'Ativar CAPTCHA';
                this.style.backgroundColor = ''; // Volta ao padrão
            }
        });
    });
});