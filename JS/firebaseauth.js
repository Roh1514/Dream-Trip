// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


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
let userTypeLogin = "";
const clienteBtnLogin = document.getElementById("cliente-login");
const organizadorBtnLogin = document.getElementById("organizador-login");


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
        const buttonContainer = clienteBtnLogin.parentElement;
        buttonContainer.parentElement.insertBefore(errorDiv, buttonContainer.nextSibling);
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

clienteBtnLogin.addEventListener('click', function () {
    userTypeLogin = "Cliente";
    console.log("Tipo de usuário (login) selecionado:", userTypeLogin);
    clienteBtnLogin.classList.add("selected");
    organizadorBtnLogin.classList.remove("selected");
});

organizadorBtnLogin.addEventListener('click', function () {
    userTypeLogin = "Organizador";
    console.log("Tipo de usuário (login) selecionado:", userTypeLogin);
    organizadorBtnLogin.classList.add("selected");
    clienteBtnLogin.classList.remove("selected");
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

    if (!userTypeLogin) {
        showErrorMessage("Por favor, selecione se você é Cliente ou Organizador.", "sign-in-form");
        return;
    }

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showErrorMessage("Erro: Email não encontrado.", "sign-in-form");
            return;
        }

        let userData = null;
        querySnapshot.forEach((doc) => {
            userData = doc.data();
        });

        if (userData.password !== password) {
            showErrorMessage("Erro: Senha incorreta.", "sign-in-form");
            return;
        }

        if (userData.userType !== userTypeLogin) {
            showErrorMessage("Erro: Tipo de usuário incorreto. Você é um " + userData.userType + ".", "sign-in-form");
            return;
        }

        console.log("Usuário logado com sucesso:", userData);
        console.log("Tipo de usuário (login):", userTypeLogin);
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        showErrorMessage("Erro: Não foi possível fazer login. Tente novamente.", "sign-in-form");
    }
});