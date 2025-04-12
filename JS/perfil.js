// Configuração do Firebase
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

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let loginCount = 42;
let isEditing = false;
let twoFactorEnabled = true;
let loginHistory = [
    "10/04/2025 14:32 - IP: 192.168.1.1",
    "09/04/2025 09:15 - IP: 192.168.1.2",
    "08/04/2025 22:47 - IP: 192.168.1.3"
];

function loadUserData() {
    console.log("Iniciando loadUserData...");
    auth.onAuthStateChanged(async (user) => {
        console.log("onAuthStateChanged disparado.");
        if (user) {
            console.log("Usuário logado detectado:", user.uid);
            try {
                const userDocRef = db.collection("users").doc(user.uid);
                const userDoc = await userDocRef.get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    console.log("Dados do Firestore:", userData);
                    document.getElementById('userName').textContent = userData.displayName || "Nome do Usuário";
                    document.getElementById('nameInput').value = userData.displayName || "Nome do Usuário";
                    document.getElementById('emailInput').value = userData.email || "usuario@email.com";
                    showNotification("Dados do usuário carregados com sucesso!");
                } else {
                    console.error("Documento do usuário não encontrado no Firestore.");
                    showNotification("Erro: Usuário não encontrado no banco de dados.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do Firestore:", error);
                showNotification("Erro ao carregar dados do usuário.");
            }
        } else {
            console.log("Nenhum usuário logado.");
            showNotification("Nenhum usuário logado. Redirecionando para login...");
            setTimeout(() => {
                window.location.href = "/login.html";
            }, 2000);
        }
    }, (error) => {
        console.error("Erro no onAuthStateChanged:", error);
        showNotification("Erro ao verificar autenticação.");
    });
}

function toggleEdit() {
    const inputs = document.querySelectorAll('#personalInfo input');
    isEditing = !isEditing;
    inputs.forEach(input => {
        input.disabled = !input.disabled;
        input.classList.toggle('editable', isEditing);
    });
    animateButton('.edit-btn');
}

async function saveChanges() {
    if (!isEditing) return;
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    nameInput.disabled = true;
    emailInput.disabled = true;
    isEditing = false;

    try {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = db.collection("users").doc(user.uid);
            await userDocRef.update({
                displayName: nameInput.value,
                email: emailInput.value
            });
            document.getElementById('userName').textContent = nameInput.value;
            showNotification('Alterações salvas com sucesso!');
        } else {
            showNotification('Nenhum usuário logado.');
        }
    } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        showNotification('Erro ao salvar alterações.');
    }
    animateButton('.save-btn');
}

function changeTheme(color) {
    document.body.style.background = `linear-gradient(135deg, ${color} 0%, #0a1a2f 100%)`;
    document.querySelector('.profile-header').style.background = `linear-gradient(45deg, ${color}, #0a1a2f)`;
    animateElement('.color-picker', 'pulse');
}

function resetTheme() {
    document.body.style.background = 'linear-gradient(135deg, #0a1a2f 0%, #1e3a5f 100%)';
    document.querySelector('.profile-header').style.background = 'linear-gradient(45deg, #1e3a5f, #0a1a2f)';
    showNotification('Tema restaurado!');
    animateButton('.btn');
}

function toggleTheme() {
    const toggle = document.querySelector('.theme-toggle');
    toggle.classList.toggle('active');
    if (toggle.classList.contains('active')) {
        document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        document.querySelector('.container').style.background = 'rgba(255,255,255,0.9)';
        document.querySelectorAll('.section').forEach(section => section.style.color = '#333');
        showNotification('Tema claro ativado!');
    } else {
        document.body.style.background = 'linear-gradient(135deg, #0a1a2f 0%, #1e3a5f 100%)';
        document.querySelector('.container').style.background = 'rgba(10,26,47,0.9)';
        document.querySelectorAll('.section').forEach(section => section.style.color = '#ddd');
        showNotification('Tema escuro ativado!');
    }
    animateElement('.theme-toggle', 'bounce');
}

function simulateLogin() {
    loginCount++;
    animateCounter('loginCount', loginCount - 1, loginCount);
    addLoginToHistory();
    showNotification('Login simulado com sucesso!');
    animateButton('.activity-counter .btn');
}

function unlockAchievement(achievementId) {
    const achievement = document.getElementById(achievementId);
    if (!achievement.classList.contains('locked')) return;
    achievement.classList.remove('locked');
    achievement.classList.add('unlocked');
    showNotification(`Conquista "${achievement.querySelector('p').textContent}" desbloqueada!`);
    animateElement(`#${achievementId}`, 'tada');
    if (achievementId === 'achievement3') updateSecurityStatus();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function animateElement(selector, animationName) {
    const element = document.querySelector(selector);
    element.style.animation = `${animationName} 0.5s ease`;
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

function animateButton(selector) {
    animateElement(selector, 'bounce');
}

function animateCounter(elementId, start, end) {
    const element = document.getElementById(elementId);
    let current = start;
    const step = (end - start) > 0 ? 1 : -1;
    const interval = setInterval(() => {
        current += step;
        element.textContent = current;
        if (current === end) clearInterval(interval);
    }, 50);
    animateElement(`#${elementId}`, 'pulse');
}

function toggleStatus() {
    const status = document.querySelector('.status');
    status.textContent = status.textContent === 'Online' ? 'Offline' : 'Online';
    status.style.background = status.textContent === 'Online' ? 'rgba(59,89,152,0.2)' : 'rgba(100,100,100,0.2)';
    showNotification(`Status alterado para ${status.textContent}!`);
}

function addParticles() {
    const header = document.querySelector('.profile-header');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = 'rgba(59,89,152,0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 5 + 2}s infinite`;
        header.appendChild(particle);
    }
}

function toggleTwoFactor() {
    const toggle = document.getElementById('twoFactorToggle');
    toggle.classList.toggle('active');
    twoFactorEnabled = toggle.classList.contains('active');
    updateSecurityStatus();
    showNotification(`2FA ${twoFactorEnabled ? 'ativado' : 'desativado'}!`);
    animateElement('#twoFactorToggle', 'bounce');
}

function updateSecurityStatus() {
    const status = document.getElementById('securityStatus');
    const twoFactorActive = document.getElementById('twoFactorToggle').classList.contains('active');
    const passwordStrength = document.getElementById('strengthBar').style.width;
    let securityLevel = 'Vulnerável';
    if (twoFactorActive && parseInt(passwordStrength) >= 75) {
        securityLevel = 'Muito Seguro';
    } else if (twoFactorActive || parseInt(passwordStrength) >= 50) {
        securityLevel = 'Protegido';
    }
    status.textContent = securityLevel;
    status.style.color = securityLevel === 'Muito Seguro' ? '#00cc00' : securityLevel === 'Protegido' ? '#3b5998' : '#ff4444';
    animateElement('#securityStatus', 'pulse');
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('strengthBar');
    let strength = 0;
    if (password.length > 12) strength += 40;
    else if (password.length > 8) strength += 30;
    else if (password.length > 4) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    strength = Math.min(strength, 100);
    strengthBar.style.width = `${strength}%`;
    strengthBar.style.background = strength >= 75 ? '#00cc00' : strength >= 50 ? '#3b5998' : '#ff4444';
    updateSecurityStatus();
}

function showChangePassword() {
    document.getElementById('changePasswordForm').classList.remove('hidden');
    animateElement('#changePasswordForm', 'pulse');
}

function hideChangePassword() {
    document.getElementById('changePasswordForm').classList.add('hidden');
    animateElement('#changePasswordForm', 'pulse');
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verifica se as senhas coincidem
    if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem!');
        return;
    }

    // Verifica o comprimento mínimo da senha
    if (newPassword.length < 8) {
        showNotification('A senha deve ter pelo menos 8 caracteres!');
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            showNotification('Nenhum usuário logado.');
            return;
        }

        // Reautenticar o usuário antes de mudar a senha
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        await user.reauthenticateWithCredential(credential);

        // Atualizar a senha no Firebase Authentication
        await user.updatePassword(newPassword);

        // Atualizar o Firestore com metadados da alteração de senha
        const userDocRef = db.collection("users").doc(user.uid);
        await userDocRef.update({
            lastPasswordChange: firebase.firestore.FieldValue.serverTimestamp(),
            passwordChangeCount: firebase.firestore.FieldValue.increment(1)
        });

        // Limpar os campos e esconder o formulário
        hideChangePassword();
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        showNotification('Senha alterada com sucesso!');
        checkPasswordStrength();
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        if (error.code === 'auth/wrong-password') {
            showNotification('Senha atual incorreta.');
        } else if (error.code === 'auth/requires-recent-login') {
            showNotification('Por favor, faça login novamente para alterar a senha.');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            showNotification('Erro ao alterar a senha. Tente novamente.');
        }
    }
}

function addLoginToHistory() {
    const date = new Date().toLocaleString('pt-BR');
    const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
    loginHistory.unshift(`${date} - IP: ${ip}`);
    updateLoginHistory();
}

function updateLoginHistory() {
    const list = document.getElementById('loginList');
    list.innerHTML = '';
    loginHistory.slice(0, 5).forEach(login => {
        const li = document.createElement('li');
        li.textContent = login;
        list.appendChild(li);
    });
}

function clearLoginHistory() {
    loginHistory = [];
    updateLoginHistory();
    showNotification('Histórico de logins limpo!');
    animateButton('#loginHistory .btn');
}

function triggerFileInput() {
    console.log("Botão 'Mudar Foto' clicado.");
    const fileInput = document.getElementById('profilePictureInput');
    if (fileInput) {
        fileInput.click();
        animateButton('#changePicButton');
        console.log("Input de arquivo acionado.");
    } else {
        console.log("Erro: #profilePictureInput não encontrado.");
        showNotification('Erro ao abrir seletor de arquivos.');
    }
}

function changeProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profileImage').src = e.target.result;
            showNotification('Foto de perfil atualizada!');
        };
        reader.readAsDataURL(file);
    }
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0% { transform: translateY(0); opacity: 0.8; }
        50% { transform: translateY(-20px); opacity: 0.4; }
        100% { transform: translateY(0); opacity: 0.8; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    @keyframes tada {
        0% { transform: scale(1); }
        10%, 20% { transform: scale(0.9) rotate(-3deg); }
        30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
        40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
        100% { transform: scale(1) rotate(0); }
    }
`;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, inicializando...");
    addParticles();
    document.querySelector('#userName').addEventListener('click', toggleStatus);
    updateLoginHistory();
    updateSecurityStatus();
    loadUserData();
});