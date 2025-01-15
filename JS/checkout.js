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
}

function displayOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    let totalPrice = 0;

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