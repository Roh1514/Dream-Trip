function toggleElement(element) {
    const content = element.nextElementSibling;

    const isOpen = content.classList.toggle('show');

    if (isOpen) {
        content.style.display = 'block';
        requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.opacity = 1;
        });
        element.classList.add('active');
    } else {
        content.style.maxHeight = 0;
        content.style.opacity = 0;
        setTimeout(() => {
            content.style.display = 'none';
        }, 300);
        element.classList.remove('active');
    }
}

