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
        document.getElementById('cpf-container').style.display = 'block';
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
    const rg = document.getElementById('rg').value.trim();
    const mensagem = document.getElementById('mensagem');

    mensagem.textContent = '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
        mensagem.textContent = 'Por favor, preencha um email válido.';
        return;
    }

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

        const totalPrice = calculateTotalPrice();
        document.getElementById('modal').style.display = 'flex';

        document.getElementById('noButton').onclick = function () {
            document.getElementById('modal').style.display = 'none';
        };

        document.getElementById('yesButton').onclick = function () {
            document.getElementById('modal').style.display = 'none';
            displayPixPaymentScreen(totalPrice);
        };

        return;
    } else if (metodoPagamento === 'boleto') {
        if (!cpf || !/^\d+$/.test(cpf)) {
            mensagem.textContent = 'Por favor, preencha um CPF válido (apenas números).';
            return;
        }
        displayBoletoPaymentScreen();
        return;
    }

    document.getElementById('modal').style.display = 'flex';

    document.getElementById('noButton').onclick = function () {
        document.getElementById('modal').style.display = 'none';
    };

    document.getElementById('yesButton').onclick = function () {
        mensagem.textContent = 'Compra realizada com sucesso!';
        document.getElementById('modal').style.display = 'none';
        displayOrderSummary();
    };
}

function calculateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function generatePixQRCode(totalPrice) {
    const pixCode = `Pix-${Math.random().toString(36).substring(2)}-R$${totalPrice}`;
    return pixCode;
}

function displayPixPaymentScreen() {
    const totalPrice = calculateTotalPrice();
    const pixPaymentContainer = document.getElementById('pix-payment-container');
    const qrCodeData = generatePixQRCode(totalPrice);

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);
    const formattedDate = expirationDate.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    pixPaymentContainer.innerHTML = `
        <div class="pix-payment">
            <div class="header">
                <h2>Pagamento com Pix</h2>
                <button class="close-button1" onclick="closePixPayment()">✖</button>
            </div>
            <canvas id="pix-qr-code" class="qr-code"></canvas>
            <p>Vencimento: ${formattedDate}</p>
            <p>Total: R$${totalPrice}</p>
            <button class="pague-button2" onclick="copyPixCode('${qrCodeData}')">Copiar código Pix</button>
        </div>
    `;

    const qrCode = new QRious({
        element: document.getElementById('pix-qr-code'),
        value: qrCodeData,
        size: 160
    });

    pixPaymentContainer.style.display = 'block';
}

function closePixPayment() {
    document.getElementById('pix-payment-container').style.display = 'none';
}

function copyPixCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        const alertBox = document.getElementById('alert');
        alertBox.innerText = 'Código Pix copiado para a área de transferência!';
        alertBox.style.display = 'block';

        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    });
}

function generateBoletoCode() {
    return `Boleto-${Math.random().toString(36).substring(2)}-Vencimento:${new Date().toLocaleDateString()}`;
}

function displayBoletoPaymentScreen() {
    const boletoCode = generateBoletoCode();
    const boletoPaymentContainer = document.getElementById('boleto-payment-container');

    boletoPaymentContainer.classList.add('active');
    boletoPaymentContainer.innerHTML = `
        <div class="boleto-payment">
            <div class="header">
                <h2>Pagamento com Boleto</h2>
                <button class="btn-button" onclick="closeBoletoPayment()">✖</button>
            </div>
            <div class="boleto1-payment">
                <textarea id="boleto-code" readonly>${boletoCode}</textarea>
                <button class="copy-button" onclick="copyBoletoCode('${boletoCode}')">Copiar código do Boleto</button>
            </div>
        </div>
        
    `;

    boletoPaymentContainer.style.display = 'block';
}

function closeBoletoPayment() {
    document.getElementById('boleto-payment-container').style.display = 'none';
    boletoPaymentContainer.classList.remove('active');
    boletoPaymentContainer.style.display = 'none';
}

function copyBoletoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        const alertBox = document.getElementById('alert');
        alertBox.innerText = 'Código do Boleto copiado para a área de transferência!';
        alertBox.style.display = 'block';

        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    });
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