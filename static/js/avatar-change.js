document.addEventListener('DOMContentLoaded', function () {
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview-img');
    const fileNameDisplay = document.getElementById('file-name');

    avatarUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // Atualiza o nome do arquivo
            fileNameDisplay.textContent = file.name;

            // Cria a preview da imagem
            const reader = new FileReader();
            reader.onload = function (event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
        }
    });
});

// Função para fechar o modal (já existente no seu código)
function closeModal(dialog) {
    dialog.close();
}