const fileInput = document.getElementById('fileInput');
const filePreviewsContainer = document.querySelector('.file-previews-container');
let selectedFiles = []; 

function createFilePreviewElement(file, index) {
    const previewItem = document.createElement('div');
    previewItem.classList.add('file-preview-item');
    previewItem.dataset.originalIndex = index;

    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('file-preview-thumbnail');


    const fileNameSpan = document.createElement('span');
    fileNameSpan.classList.add('file-preview-name');
    fileNameSpan.textContent = file.name;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-file-button');
    const closeIconSpan = document.createElement('span');
    closeIconSpan.classList.add('material-symbols-outlined');
    closeIconSpan.textContent = 'close';
    removeButton.appendChild(closeIconSpan);
    removeButton.type = 'button';

    removeButton.onclick = () => {
        const itemIndex = parseInt(previewItem.dataset.originalIndex, 10);
        removeFilePreview(itemIndex);
    };

    previewItem.appendChild(thumbnailDiv);
    previewItem.appendChild(fileNameSpan);
    previewItem.appendChild(removeButton);

    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
            thumbnailDiv.appendChild(img);
        };

        reader.onerror = (e) => {
            console.error('Erro ao ler arquivo de imagem:', file.name, e);
            const itemIndex = parseInt(previewItem.dataset.originalIndex, 10);
            removeFilePreview(itemIndex);
        };

        reader.readAsDataURL(file);

    } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let videoObjectURL = null; 

        video.autoplay = false;
        video.muted = true;
        video.playsInline = true;

        video.addEventListener('loadeddata', () => {
            const thumbnailSize = 40;
            canvas.width = thumbnailSize;
            canvas.height = thumbnailSize;

            video.currentTime = 0.1;
        });

        video.addEventListener('seeked', () => {
            try {

                const videoRatio = video.videoWidth / video.videoHeight;
                const thumbnailRatio = canvas.width / canvas.height;
                let sx, sy, sWidth, sHeight;

                if (videoRatio > thumbnailRatio) {
                    sHeight = video.videoHeight;
                    sWidth = sHeight * thumbnailRatio;
                    sx = (video.videoWidth - sWidth) / 2;
                    sy = 0;
                } else {
                    sWidth = video.videoWidth;
                    sHeight = sWidth / thumbnailRatio;
                    sx = 0;
                    sy = (video.videoHeight - sHeight) / 2;
                }

                context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/jpeg');

                thumbnailDiv.appendChild(img);

                if (videoObjectURL) URL.revokeObjectURL(videoObjectURL);

            } catch (e) {
                console.error('Erro ao gerar thumbnail do vídeo:', file.name, e);
                const itemIndex = parseInt(previewItem.dataset.originalIndex, 10);
                removeFilePreview(itemIndex);
                if (videoObjectURL) URL.revokeObjectURL(videoObjectURL);
            }

        }, { once: true });

        video.addEventListener('error', (e) => {
            console.error('Erro ao carregar vídeo para thumbnail:', file.name, e);
            const itemIndex = parseInt(previewItem.dataset.originalIndex, 10);
            removeFilePreview(itemIndex);
            const errorIcon = document.createElement('span');
            errorIcon.textContent = '❌'; 
            errorIcon.style.fontSize = '1.5rem';
            thumbnailDiv.appendChild(errorIcon);

            if (videoObjectURL) URL.revokeObjectURL(videoObjectURL);
        });

        videoObjectURL = URL.createObjectURL(file);
        video.src = videoObjectURL;

    } else {
        const fileIcon = document.createElement('span');
        fileIcon.textContent = '📄';
        fileIcon.style.fontSize = '1.5rem';
        thumbnailDiv.appendChild(fileIcon);
    }

    return previewItem;
}

function removeFilePreview(index) {
    console.log('Removendo arquivo no índice:', index);
    const itemToRemove = filePreviewsContainer.querySelector(`.file-preview-item[data-original-index="${index}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
    }

    if (index >= 0 && index < selectedFiles.length) {
        selectedFiles[index] = null;
    } else {
        console.warn('Tentativa de remover índice inválido:', index);
    }

    const currentFileCount = selectedFiles.filter(file => file !== null).length;
    console.log('Contagem atual de arquivos:', currentFileCount);
    if (currentFileCount < 3) {
        document.querySelector('.select-file-button').disabled = false;
    }
}

function addFiles(files) {
    const selectButton = document.querySelector('.select-file-button');
    const currentFileCount = selectedFiles.filter(file => file !== null).length;
    const filesToAdd = Array.from(files).slice(0, 3 - currentFileCount);

    if (filesToAdd.length === 0) {
        if (currentFileCount >= 3) {
            selectButton.disabled = true;
        }
        return; 
    }

    filesToAdd.forEach(file => {
        let nextIndex = selectedFiles.indexOf(null);
        if (nextIndex === -1) {
            nextIndex = selectedFiles.length;
            selectedFiles.push(file); 
        } else {
            selectedFiles[nextIndex] = file; 
        }

        const previewElement = createFilePreviewElement(file, nextIndex);

        setTimeout(() => {
            filePreviewsContainer.appendChild(previewElement);
            const updatedFileCount = selectedFiles.filter(f => f !== null).length;
            if (updatedFileCount >= 3) {
                selectButton.disabled = true;
            }

        }, 0); 

    });

    console.log("Scheduled addition for:", filesToAdd.map(f => f ? f.name : null));
    console.log("selectedFiles total (não-null) após agendar adição:", selectedFiles.filter(f => f !== null).length);
}

function removeFilePreview(index) {
    console.log('Removendo arquivo no índice:', index);
    const itemToRemove = filePreviewsContainer.querySelector(`.file-preview-item[data-original-index="${index}"]`);
    if (itemToRemove) {
        itemToRemove.remove();
    }

    if (index >= 0 && index < selectedFiles.length) {
        selectedFiles[index] = null; 
    } else {
        console.warn('Tentativa de remover índice inválido:', index);
    }

    const selectButton = document.querySelector('.select-file-button');
    const currentFileCount = selectedFiles.filter(file => file !== null).length;
    if (currentFileCount < 3) {
        selectButton.disabled = false;
    }

    console.log("selectedFiles após remove:", selectedFiles.map(f => f ? f.name : null));
    console.log('Contagem atual (não-null):', currentFileCount);
}

fileInput.addEventListener('change', (event) => {
    if (event.target.files.length > 0) {
        addFiles(event.target.files);
        fileInput.value = '';
    }
});

function getFilesToUpload() {
    return selectedFiles.filter(file => file !== null);
}