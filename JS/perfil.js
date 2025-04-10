function toggleEdit() {
    const inputs = document.querySelectorAll('#personalInfo input');
    const editBtn = document.querySelector('.edit-btn');
    const saveBtn = document.querySelector('.save-btn');

    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });

    editBtn.style.display = inputs[0].disabled ? 'inline-block' : 'none';
    saveBtn.style.display = inputs[0].disabled ? 'none' : 'inline-block';
}

function saveChanges() {
    const nameInput = document.querySelector('#personalInfo input[type="text"]');
    document.getElementById('userName').textContent = nameInput.value;
    toggleEdit();
    alert('Alterações salvas com sucesso!');
}

function changeTheme(color) {
    document.body.style.background = `linear-gradient(135deg, ${color}, #2a5298)`;
    document.querySelector('.container').style.boxShadow = `0 10px 30px ${color}40`;
}

function resetTheme() {
    document.body.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
    document.querySelector('.container').style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
}