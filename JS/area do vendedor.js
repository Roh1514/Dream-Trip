const form = document.getElementById('travel-package-form');
const packagesList = document.getElementById('packages-list');
const feedbackDiv = document.getElementById('feedback');

let currentEditRow = null; // Track the current row being edited

function isValidPrice(price) {
    return /^\d+(\.\d{1,2})?$/.test(price);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const destinos = document.getElementById('destinos').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const dataInicio = document.getElementById('dataInicio').value;
    const dataTermino = document.getElementById('dataTermino').value;
    const localizacao = document.getElementById('localizacao').value.trim();
    const preco = document.getElementById('preco').value.trim();
    const imagem = document.getElementById('imagem').files[0];
    const duracao = document.getElementById('duracao').value.trim();
    const vagas = document.getElementById('vagas').value.trim();

    if (!destinos || !descricao || !dataInicio || !dataTermino || !localizacao ||
        !isValidPrice(preco) || !duracao || !vagas || !imagem) {
        feedbackDiv.innerHTML = '<p class="validacao">Por favor, preencha todos os campos corretamente.</p>';
        return;
    }

    if (currentEditRow) {
        // Update the existing row
        currentEditRow.innerHTML = `
            <td>${destinos}</td>
            <td>${dataInicio} - ${dataTermino}</td>
            <td>R$ ${parseFloat(preco).toFixed(2)}</td>
            <td>
                <button onclick="editPackage(this)">Editar</button>
                <button onclick="deletePackage(this)">Excluir</button>
            </td>
        `;
        feedbackDiv.innerHTML = '<p class="validacao2">Pacote atualizado com sucesso!</p>';
    } else {
        // Create a new row
        const packageRow = document.createElement('tr');
        packageRow.innerHTML = `
            <td>${destinos}</td>
            <td>${dataInicio} - ${dataTermino}</td>
            <td>R$ ${parseFloat(preco).toFixed(2)}</td>
            <td>
                <button onclick="editPackage(this)">Editar</button>
                <button onclick="deletePackage(this)">Excluir</button>
            </td>
        `;
        packagesList.appendChild(packageRow);
        feedbackDiv.innerHTML = '<p class="validacao2">Pacote adicionado com sucesso!</p>';
    }

    form.reset();
    currentEditRow = null; // Reset the current edit row
});

function editPackage(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    // Populate the form with the existing package data
    document.getElementById('destinos').value = cells[0].innerText;
    const dates = cells[1].innerText.split(' - ');
    document.getElementById('dataInicio').value = dates[0].trim();
    document.getElementById('dataTermino').value = dates[1].trim();
    document.getElementById('preco').value = cells[2].innerText.replace('R$ ', '').trim();

    // Set the currentEditRow to the row being edited
    currentEditRow = row;

    // Optionally, you could set focus to the first input field for convenience
    document.getElementById('destinos').focus();
}

function deletePackage(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    feedbackDiv.innerHTML = '<p class="validacao2">Pacote excluído com sucesso!</p>';
}