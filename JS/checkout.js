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
        // Exibir o modal de confirmação antes de mostrar o pagamento via Pix
        document.getElementById('modal').style.display = 'flex';

        // Lidar com os botões de confirmação
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
    }

    // Exibir o modal de confirmação para outros métodos de pagamento
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
    // Aqui você pode gerar um QR Code aleatório para o Pix
    const pixCode = `Pix-${Math.random().toString(36).substring(2)}-R$${totalPrice}`;
    return pixCode; // Retorne os dados que serão codificados no QR Code
}

function displayPixPaymentScreen(totalPrice) {
    const pixPaymentContainer = document.getElementById('pix-payment-container');
    const qrCodeData = generatePixQRCode(totalPrice);

    // Gerar data de vencimento (exemplo: 2 horas a partir de agora)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 2);
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
            <div class="qr-code">${qrCodeData}</div>
            <p>Vencimento: ${formattedDate}</p>
            <p>Total: R$${totalPrice}</p>
            <button class="pague-button2" onclick="copyPixCode('${qrCodeData}')">Copiar código Pix</button>
        </div>
    `;
    pixPaymentContainer.style.display = 'block';
}
function closePixPayment() {
    document.getElementById('pix-payment-container').style.display = 'none';
}

function copyPixCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert('Código Pix copiado para a área de transferência!');
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