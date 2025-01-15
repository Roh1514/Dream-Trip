document.addEventListener('DOMContentLoaded', function () {
    let cart = [];
    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        updateCartSidebar();
        if (!document.querySelector('.sidebar-cart').classList.contains('active')) {
            toggleCartSidebar();
        }
    }
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartSidebar();
    }
    function updateCartSidebar() {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span class="item-name">${item.name}</span>
                <span class="item-price">R$${item.price.toFixed(2)}</span>
                <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-index="${index}">
                <button class="remove-item" data-index="${index}">🗑️</button>`;
            cartContainer.appendChild(li);
            total += item.price * item.quantity;
        });
        document.querySelector('.total-price').innerText = `R$${total.toFixed(2)}`;
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(button.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', function () {
                const index = parseInt(input.getAttribute('data-index'));
                const quantity = parseInt(input.value);

                if (quantity < 1) {
                    removeFromCart(index);
                } else {
                    cart[index].quantity = quantity;
                    updateCartSidebar();
                }
            });
        });
    }
    function toggleCartSidebar() {
        const sidebar = document.querySelector('.sidebar-cart');
        sidebar.classList.toggle('active');
    }
    function proceedToCheckout() {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'area de pagamento.html';
    }
    document.querySelector('.close-cart').addEventListener('click', function () {
        toggleCartSidebar();
    });
    document.querySelector('.close-cart-mobile').addEventListener('click', function () {
        toggleCartSidebar();
    });
    document.querySelector('.buy-now').addEventListener('click', proceedToCheckout);

    document.querySelectorAll('.card_button button').forEach(button => {
        button.addEventListener('click', function (event) {
            const card = button.closest('.card');
            const productName = card.querySelector('h1').innerText;
            const productPrice = parseFloat(card.querySelector('p').innerText.replace('R$', '').replace(',', '.'));
            const productImage = card.querySelector('img').src;

            addToCart({ name: productName, price: productPrice, image: productImage });
        });
    });
});