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

    document.querySelector('.close-cart')?.addEventListener('click', toggleCartSidebar);
    document.querySelector('.close-cart-mobile')?.addEventListener('click', toggleCartSidebar);
    document.querySelector('.buy-now')?.addEventListener('click', proceedToCheckout);

    document.querySelectorAll('.card_button button').forEach(button => {
        button.addEventListener('click', function () {
            const card = button.closest('.card');
            const productName = card.querySelector('h1').innerText;
            const productPrice = parseFloat(card.querySelector('p').innerText.replace('R$', '').replace(',', '.'));
            const productImage = card.querySelector('img').src;

            addToCart({ name: productName, price: productPrice, image: productImage });
        });
    });

    function toggleElement(element) {
        if (!element || !element.nextElementSibling) {
            console.error('Elemento ou conteúdo não encontrado.');
            return;
        }

        const content = element.nextElementSibling;
        const isOpen = content.classList.contains('show');
        const allFaqItems = document.querySelectorAll('.faq h3');
        allFaqItems.forEach((item) => {
            if (item !== element) {
                const otherContent = item.nextElementSibling;
                if (otherContent.classList.contains('show')) {
                    otherContent.classList.remove('show');
                    otherContent.style.maxHeight = '0';
                    otherContent.style.opacity = '0';
                    item.classList.remove('active');
                }
            }
        });

        if (!isOpen) {
            content.classList.add('show');
            content.style.display = 'block';
            requestAnimationFrame(() => {
                content.style.maxHeight = `${content.scrollHeight}px`;
                content.style.opacity = '1';
            });
            element.classList.add('active');
        } else {
            content.classList.remove('show');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            element.classList.remove('active');
        }
    }

    const faqItems = document.querySelectorAll('.faq h3');
    faqItems.forEach((item) => {
        item.addEventListener('click', () => toggleElement(item));
    });

    const profileLink = document.querySelector('.profile-link');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userAvatar = document.querySelector('.user-avatar');
    const profileLinkItem = document.querySelector('#profile-link');
    const loginButton = document.querySelector('.login-button');

    if (profileLink && dropdownMenu && userAvatar) {
        userAvatar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');

            if (dropdownMenu.classList.contains('active')) {
                faqItems.forEach((item) => {
                    const content = item.nextElementSibling;
                    if (content.classList.contains('show')) {
                        content.classList.remove('show');
                        content.style.maxHeight = '0';
                        content.style.opacity = '0';
                        item.classList.remove('active');
                    }
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!profileLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });

        if (profileLinkItem) {
            profileLinkItem.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.classList.remove('active');
                setTimeout(() => {
                    window.location.href = '/cabecalho/perfil.html';
                }, 400);
            });
        }

        const logoutButton = document.querySelector('#logout-button');
        const logoutModal = document.querySelector('#logout-modal');
        const confirmLogout = document.querySelector('#confirm-logout');
        const cancelLogout = document.querySelector('#cancel-logout');

        if (logoutButton && logoutModal && confirmLogout && cancelLogout) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.remove('active');
                logoutModal.classList.add('active');
            });

            confirmLogout.addEventListener('click', () => {
                if (typeof firebase !== 'undefined') {
                    firebase.auth().signOut().then(() => {
                        window.location.href = '/index.html';
                    }).catch((error) => {
                        console.error('Erro ao fazer logout:', error);
                    });
                } else {
                    window.location.href = '/index.html';
                }
            });

            cancelLogout.addEventListener('click', () => {
                logoutModal.classList.remove('active');
            });

            logoutModal.addEventListener('click', (e) => {
                if (e.target === logoutModal) {
                    logoutModal.classList.remove('active');
                }
            });
        }
    }

    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            setTimeout(() => {
                window.location.href = '/cabecalho/login-cadastro.html';
            }, 100);
        });
    }

    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged((user) => {
            const loginButton = document.querySelector('.login-button');
            const profileArea = document.querySelector('.profile-area');

            if (user) {
                loginButton.style.display = 'none';
                profileArea.style.display = 'inline-block';
                const avatar = document.querySelector('.user-avatar');
                avatar.src = user.photoURL || '/assets/default-avatar.png';
            } else {
                loginButton.style.display = 'inline-block';
                profileArea.style.display = 'none';
            }
        });
    }

    const loader = document.querySelector('.loader');
    const content = document.querySelector('.content');

    if (loader && content) {
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.style.display = 'none';
            content.style.display = 'block';
        }, 1500);
    }
});

