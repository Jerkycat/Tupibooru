document.addEventListener("DOMContentLoaded", function () {
  // Função para redimensionar uma textarea específica
  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Seleciona as textareas
  const textareas = document.querySelectorAll('.comment-type textarea, .reply-type textarea');

  textareas.forEach(textarea => {
    // Redimensiona no input do usuário
    textarea.addEventListener('input', () => {
      autoResize(textarea);
    });

    // IMPORTANTE: Verifica se a textarea está visível antes de redimensionar no carregamento.
    // Se ela começar visível, já ajusta o tamanho.
    if (textarea.offsetParent !== null) {
      autoResize(textarea);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const commentButtons = document.querySelectorAll('.comment-buttons');

  commentButtons.forEach(comment => {
    const replyButton = comment.querySelector(':scope > .default-button'); // botão externo
    const replyType = comment.querySelector('.reply-type');
    const cancelButton = comment.querySelector('.cancel');
    const textarea = comment.querySelector('textarea');

    replyType.style.display = 'none';

    replyButton.addEventListener('click', function () {
      replyButton.style.display = 'none';
      replyType.style.display = 'block';
      textarea.focus(); // coloca o foco no textarea automaticamente
    });

    cancelButton.addEventListener('click', function () {
      replyType.style.display = 'none';
      replyButton.style.display = 'inline-block';
    });
  });
});