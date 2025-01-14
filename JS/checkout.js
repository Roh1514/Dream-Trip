document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Quantity: ${item.quantity} - Price: R$${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(li);

        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    document.getElementById('total-quantity').textContent = totalQuantity;
    document.getElementById('total-price').textContent = `R$${totalPrice.toFixed(2)}`;

    document.getElementById('confirm-checkout').addEventListener('click', function () {
        alert('Checkout processado com sucesso!');
        localStorage.removeItem('cart');
    });
});