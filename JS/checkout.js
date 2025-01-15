let metodoPagamento = '';

function selectPaymentMethod(method, icon) {
    document.getElementById('card-container').style.display = 'none';
    document.getElementById('expiry-container').style.display = 'none';
    document.getElementById('cvv-container').style.display = 'none';
    document.getElementById('pix-container').style.display = 'none';
    document.getElementById('cpf-container').style.display = 'none';
    document.getElementById('dob-container').style.display = 'none';
    document.getElementById('rg-container').style.display = 'none';
    document.getElementById('email-container').style.display = 'block';

    if (method === 'visa' || method === 'mastercard') {
        document.getElementById('card-container').style.display = 'block';
        document.getElementById('expiry-container').style.display = 'block';
        document.getElementById('cvv-container').style.display = 'block';
    } else if (method === 'pix') {
        document.getElementById('pix-container').style.display = 'block';
        document.getElementById('cpf-container').style.display = 'block';
        document.getElementById('rg-container').style.display = 'block';
    } else if (method === 'boleto') {
        document.getElementById('dob-container').style.display = 'block';
        document.getElementById('full-name').style.display = 'block';
    }

    const paymentIcons = document.querySelectorAll('.payment-methods img');
    paymentIcons.forEach(otherIcon => otherIcon.classList.remove('selected'));
    icon.classList.add('selected');

    metodoPagamento = method;
}

function verificarCampos() {
    const email = document.getElementById('email').value.trim();
    const card = document.getElementById('card').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const fullName = document.getElementById('full-name').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const rg = document.getElementById('rg').value.trim();
    const mensagem = document.getElementById('mensagem');

    mensagem.textContent = '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/[0-9]{4}$/;

    // Validação de e-mail
    if (!email || !emailPattern.test(email)) {
        mensagem.textContent = 'Por favor, preencha um email válido.';
        return;
    }

    // Validação para diferentes métodos de pagamento
    if (metodoPagamento === 'visa' || metodoPagamento === 'mastercard') {
        if (!card) {
            mensagem.textContent = 'Por favor, preencha o número do cartão.';
            return;
        }
        if (!expiry) {
            mensagem.textContent = 'Por favor, preencha a data de validade.';
            return;
        }
        if (!cvv) {
            mensagem.textContent = 'Por favor, preencha o CVV.';
            return;
        }
    } else if (metodoPagamento === 'pix') {
        if (!fullName) {
            mensagem.textContent = 'Por favor, preencha seu nome completo.';
            return;
        }
        if (!cpf || !/^\d+$/.test(cpf)) {
            mensagem.textContent = 'Por favor, preencha um CPF válido (apenas números).';
            return;
        }
        if (!rg || !/^\d+$/.test(rg)) {
            mensagem.textContent = 'Por favor, preencha um RG válido (apenas números).';
            return;
        }
    } else if (metodoPagamento === 'boleto') {
        if (!dob || !dobPattern.test(dob)) {
            mensagem.textContent = 'Por favor, preencha a data de nascimento no formato dd/mm/yyyy.';
            return;
        }
    }

    mensagem.textContent = 'Compra realizada com sucesso!';
    displayOrderSummary();
}

function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    let totalPrice = 0;

    orderItemsContainer.innerHTML = '';

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.className = 'order-summary-item';
        itemElement.innerHTML = `<span>${item.name} (x${item.quantity})</span><span>R$${(item.price * item.quantity).toFixed(2)}</span>`;
        orderItemsContainer.appendChild(itemElement);
    });

    document.getElementById('total-price').innerText = `R$${totalPrice.toFixed(2)}`;
}

window.onload = displayOrderSummary;