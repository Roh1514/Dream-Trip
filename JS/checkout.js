document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    let totalQuantidade = 0;
    let totalPreço = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(li);

        totalQuantidade += item.quantity;
        totalPreço += item.price * item.quantity;
    });
    document.getElementById('total-quantity').textContent = totalQuantidade;
    document.getElementById('total-price').textContent = `R$${totalPreço.toFixed(2)}`;

    document.getElementById('confirm-checkout').addEventListener('click', function () {
        alert('Checkout processado com sucesso!');
        localStorage.removeItem('cart');
    });
});