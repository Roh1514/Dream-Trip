function toggleElement(element) {
    const content = element.nextElementSibling;

    const isOpen = content.classList.toggle('show');

    if (isOpen) {
        content.style.display = 'block'; // Exibe o conteúdo
        requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + "px"; // Ajusta a altura
            content.style.opacity = 1; // Define opacidade
        });
        element.classList.add('active'); // Adiciona classe para efeito bonito
    } else {
        content.style.maxHeight = 0; // Reduz a altura
        content.style.opacity = 0; // Define opacidade
        setTimeout(() => {
            content.style.display = 'none'; // Esconde após a animação
        }, 300); // Tempo para coincidir com a duração da transição CSS
        element.classList.remove('active'); // Remove classe para efeito bonito
    }
}