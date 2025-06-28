document.addEventListener('DOMContentLoaded', function () {
    const postEngageSections = document.querySelectorAll('.post-engage');

    postEngageSections.forEach(section => {
        const bumpButton = section.querySelector('.bump');
        const sageButton = section.querySelector('.sage');
        let bumpActive = false;

        // Função para remover a classe ativa de ambos
        function resetButtons() {
            bumpButton.classList.remove('button-active');
            sageButton.classList.remove('button-active');
        }

        // Clique no Bump
        bumpButton.addEventListener('click', function () {
            if (bumpActive) return; // Se já estiver ativo, não faz nada

            bumpActive = true;
            resetButtons();
            bumpButton.classList.add('button-active');
        });

        // Clique no Sage
        sageButton.addEventListener('click', function () {
            if (bumpActive) return; // Se Bump estiver ativo, não faz nada

            // Toggle do Sage (se já estiver ativo, desativa)
            sageButton.classList.toggle('button-active');
        });
    });
});