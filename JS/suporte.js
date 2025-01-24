function sendMessage(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    document.getElementById('confirmationModal').style.display = 'flex'; // Mostra o modal
    document.getElementById('supportForm').reset(); // Limpa o formulário
    return false; // Previne ações adicionais
}

function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none'; // Esconde o modal
}