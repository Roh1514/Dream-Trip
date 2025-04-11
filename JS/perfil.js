let loginCount = 42;
let isEditing = false;
let twoFactorEnabled = true;
let loginHistory = [
    "10/04/2025 14:32 - IP: 192.168.1.1",
    "09/04/2025 09:15 - IP: 192.168.1.2",
    "08/04/2025 22:47 - IP: 192.168.1.3"
];

function toggleEdit() {
    const inputs = document.querySelectorAll('#personalInfo input');
    isEditing = !isEditing;
    inputs.forEach(input => {
        input.disabled = !input.disabled;
        input.classList.toggle('editable', isEditing);
    });
    animateButton('.edit-btn');
}

function saveChanges() {
    if (!isEditing) return;
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    nameInput.disabled = true;
    emailInput.disabled = true;
    isEditing = false;
    showNotification('Alterações salvas com sucesso!');
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

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem!');
        return;
    }
    if (newPassword.length < 8) {
        showNotification('A senha deve ter pelo menos 8 caracteres!');
        return;
    }
    hideChangePassword();
    showNotification('Senha alterada com sucesso!');
    checkPasswordStrength();
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
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

function triggerFileInput() {
    console.log("Botão 'Mudar Foto' clicado.");
    const fileInput = document.getElementById('profilePictureInput');
    if (fileInput) {
        fileInput.click();
        animateButton('.change-picture-btn');
        console.log("Input de arquivo acionado.");
    } else {
        console.log("Erro: #profilePictureInput não encontrado.");
        showNotification('Erro ao abrir seletor de arquivos.');
    }
}


window.onload = () => {
    addParticles();
    document.querySelector('#userName').addEventListener('click', toggleStatus);
    updateLoginHistory();
    updateSecurityStatus();
};