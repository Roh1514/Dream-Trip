// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD76ms3XFc5TpUa0oJBuqJKlR8yBnTAPv4",
    authDomain: "dream-trip-3ccb3.firebaseapp.com",
    databaseURL: "https://dream-trip-3ccb3-default-rtdb.firebaseio.com",
    projectId: "dream-trip-3ccb3",
    storageBucket: "dream-trip-3ccb3.firebasestorage.app",
    messagingSenderId: "462885890076",
    appId: "1:462885890076:web:816bb3729a407fabe3d7d9",
    measurementId: "G-2XC38CH1KZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const submitSignup = document.getElementById("submit");
let userTypeSignup = "";
const clienteBtn = document.getElementById("cliente");
const organizadorBtn = document.getElementById("organizador");

const submitLogin = document.getElementById("submit-login");

function showErrorMessage(message, formType) {
    const existingMessage = document.querySelector(`.${formType} .error-message`);
    if (existingMessage) {
        existingMessage.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = message;

    if (formType === "sign-up-form") {
        const buttonContainer = clienteBtn.parentElement;
        buttonContainer.parentElement.insertBefore(errorDiv, buttonContainer.nextSibling);
    } else if (formType === "sign-in-form") {
        const loginButton = document.getElementById("submit-login");
        loginButton.parentElement.insertBefore(errorDiv, loginButton.nextSibling);
    }

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function validatePassword(password) {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, message: "A senha deve ter pelo menos 8 caracteres." };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: "A senha deve conter pelo menos 1 caractere especial (ex.: !, @, #)." };
    }
    if (!hasNumber) {
        return { isValid: false, message: "A senha deve conter pelo menos 1 número." };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: "A senha deve conter pelo menos 1 letra maiúscula." };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: "A senha deve conter pelo menos 1 letra minúscula." };
    }

    return { isValid: true, message: "" };
}

clienteBtn.addEventListener('click', function () {
    userTypeSignup = "Cliente";
    console.log("Tipo de usuário (cadastro) selecionado:", userTypeSignup);
    clienteBtn.classList.add("selected");
    organizadorBtn.classList.remove("selected");
});

organizadorBtn.addEventListener('click', function () {
    userTypeSignup = "Organizador";
    console.log("Tipo de usuário (cadastro) selecionado:", userTypeSignup);
    organizadorBtn.classList.add("selected");
    clienteBtn.classList.remove("selected");
});

submitSignup.addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showErrorMessage(passwordValidation.message, "sign-up-form");
        return;
    }

    if (!userTypeSignup) {
        showErrorMessage("Por favor, selecione se você é Cliente ou Organizador.", "sign-up-form");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuário criado com sucesso:", user);
            console.log("Tipo de usuário (cadastro):", userTypeSignup);

            return setDoc(doc(db, "users", user.uid), {
                email: user.email,
                uid: user.uid,
                displayName: username,
                userType: userTypeSignup,
                password: password
            });
        })
        .then(() => {
            console.log("Dados do usuário salvos no Firestore com sucesso.");
            window.location.href = "/index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao criar usuário ou salvar dados:", errorCode, errorMessage);
            showErrorMessage("Erro: " + errorMessage, "sign-up-form");
        });
});

submitLogin.addEventListener('click', async function (event) {
    event.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showErrorMessage(passwordValidation.message, "sign-in-form");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Usuário logado com sucesso:", user);
        window.location.href = "/index.html";

    } catch (error) {
        console.error("Erro ao fazer login:", error);
        let errorMessage = "Erro: Não foi possível fazer login. Verifique suas credenciais.";
        if (error.code === "auth/user-not-found") {
            errorMessage = "Erro: Email não encontrado.";
        } else if (error.code === "auth/wrong-password") {
            errorMessage = "Erro: Senha incorreta.";
        }
        showErrorMessage(errorMessage, "sign-in-form");
    }
});