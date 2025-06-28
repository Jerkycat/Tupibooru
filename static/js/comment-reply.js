document.addEventListener("DOMContentLoaded", function() {
  // Função para redimensionar uma textarea específica
  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Seleciona as textareas
  const textareas = document.querySelectorAll('.reply-type textarea, .comment-input textarea');

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

  /*
   * Se as suas textareas são reveladas por um clique de botão (e não no carregamento da página),
   * você precisa chamar a função autoResize() no momento em que elas se tornam visíveis.
   *
   * Exemplo:
   * const replyButton = document.querySelector('.seu-botao-de-responder');
   * const replyTextarea = document.querySelector('.reply-type textarea');
   *
   * replyButton.addEventListener('click', () => {
   * // seu código que mostra a div da textarea...
   * replyTextarea.style.display = 'block';
   *
   * // Chama o redimensionamento logo após ela se tornar visível.
   * autoResize(replyTextarea);
   * });
   */
});