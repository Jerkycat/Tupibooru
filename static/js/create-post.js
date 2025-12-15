// Gerenciamento de anexos de arquivos
const MAX_FILES = 3;
let attachedFiles = [];
let fileInput = null;

// Função para obter elementos atualizados
function getElements() {
    return {
        filePreviewsContainer: document.querySelector('.file-previews'),
        selectFileButton: document.querySelector('.popup-post button[type="button"]:not(.cancel):not(.file-preview-remove)')
    };
}

// Criar input file escondido
function createFileInput() {
    if (fileInput) return fileInput;
    
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.accept = 'image/*, video/*, .pdf, .txt';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', handleFileSelection);
    
    return fileInput;
}

// Função para inicializar o botão de seleção
function initializeSelectButton() {
    const { selectFileButton } = getElements();
    
    if (selectFileButton && !selectFileButton.dataset.initialized) {
        selectFileButton.dataset.initialized = 'true';
        selectFileButton.onclick = function(e) {
            e.preventDefault();
            if (!selectFileButton.disabled) {
                const input = createFileInput();
                input.click();
            }
        };
        updateButtonState();
    }
}

// Observar quando o popup é aberto
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.classList && node.classList.contains('popup-post')) {
                initializePopup();
            }
        });
        
        // Verificar se o popup foi aberto (open attribute)
        if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
            const popup = mutation.target;
            if (popup.classList.contains('popup-post') && popup.hasAttribute('open')) {
                initializePopup();
            }
        }
    });
});

// Inicializar popup
function initializePopup() {
    createFileInput();
    initializeSelectButton();
    
    // Configurar botão de cancelar
    const cancelButton = document.querySelector('.popup-post .cancel');
    if (cancelButton && !cancelButton.dataset.initialized) {
        cancelButton.dataset.initialized = 'true';
        cancelButton.addEventListener('click', clearAllAttachments);
    }
    
    // Limpar anexos ao abrir o popup
    clearAllAttachments();
}

// Evento de mudança no input file
function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    const { filePreviewsContainer } = getElements();
    
    if (!filePreviewsContainer) {
        console.error('Container de previews não encontrado. Verifique se o popup está aberto.');
        return;
    }
    
    files.forEach(file => {
        // Verificar se já temos 3 arquivos
        if (attachedFiles.length >= MAX_FILES) {
            return;
        }
        
        // Adicionar arquivo à lista
        attachedFiles.push(file);
        
        // Criar preview
        createFilePreview(file);
    });
    
    // Resetar input
    fileInput.value = '';
    
    // Atualizar estado do botão
    updateButtonState();
}

// Função para criar preview de arquivo
function createFilePreview(file) {
    const { filePreviewsContainer } = getElements();
    
    if (!filePreviewsContainer) {
        console.error('Container de previews não encontrado');
        return;
    }
    
    const section = document.createElement('section');
    
    // Preview (imagem ou ícone)
    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.classList.add('file-preview-image');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        section.appendChild(img);
    } else {
        const icon = document.createElement('span');
        icon.classList.add('file-preview-icon', 'material-symbols-outlined');
        
        // Definir ícone baseado no tipo de arquivo
        if (file.type.startsWith('video/')) {
            icon.textContent = 'video_file';
        } else if (file.type === 'application/pdf') {
            icon.textContent = 'picture_as_pdf';
        } else {
            icon.textContent = 'draft';
        }
        
        section.appendChild(icon);
    }
    
    // Nome do arquivo
    const fileName = document.createElement('span');
    fileName.classList.add('file-preview-name');
    fileName.textContent = file.name;
    section.appendChild(fileName);
    
    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('default-button');
    removeBtn.classList.add('file-preview-remove');
    removeBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
    
    removeBtn.addEventListener('click', function() {
        // Remover arquivo da lista
        const index = attachedFiles.indexOf(file);
        if (index > -1) {
            attachedFiles.splice(index, 1);
        }
        
        // Remover preview
        section.remove();
        
        // Atualizar estado do botão
        updateButtonState();
    });
    
    section.appendChild(removeBtn);
    
    // Adicionar ao container
    filePreviewsContainer.appendChild(section);
}

// Função para atualizar o estado do botão
function updateButtonState() {
    const { selectFileButton } = getElements();
    
    if (!selectFileButton) return;
    
    if (attachedFiles.length >= MAX_FILES) {
        selectFileButton.disabled = true;
        selectFileButton.textContent = `Máximo de ${MAX_FILES} arquivos atingido`;
    } else {
        selectFileButton.disabled = false;
        selectFileButton.textContent = `Selecione um arquivo (${attachedFiles.length}/${MAX_FILES})`;
    }
}

// Limpar todos os anexos
function clearAllAttachments() {
    attachedFiles = [];
    const { filePreviewsContainer } = getElements();
    if (filePreviewsContainer) {
        filePreviewsContainer.innerHTML = '';
    }
    updateButtonState();
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Observar mudanças no body para detectar quando o popup é adicionado
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['open']
        });
        
        // Tentar inicializar se o popup já existir
        if (document.querySelector('.popup-post')) {
            initializePopup();
        }
    });
} else {
    // DOM já está pronto
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['open']
    });
    
    // Tentar inicializar se o popup já existir
    if (document.querySelector('.popup-post')) {
        initializePopup();
    }
}