function mostrarSenha() {
    var inputfield = document.getElementById('password');
    var btnShowPass = document.getElementById('btn-senha');

    if (inputfield.type === 'password') {
        inputfield.type = 'text';
        btnShowPass.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        inputfield.type = 'password';
        btnShowPass.classList.replace('fa-eye', 'fa-eye-slash');
    }
}

function mostrarSenha2() {
    var inputfield = document.getElementById('signup-password');
    var btnShowPass = document.getElementById('btn-senha2');

    if (inputfield.type === 'password') {
        inputfield.type = 'text';
        btnShowPass.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        inputfield.type = 'password';
        btnShowPass.classList.replace('fa-eye', 'fa-eye-slash');
    }
}

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});