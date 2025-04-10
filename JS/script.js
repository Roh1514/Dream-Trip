document.addEventListener('DOMContentLoaded', () => {
    // Função para o FAQ (melhorada)
    function toggleElement(element) {
        if (!element || !element.nextElementSibling) {
            console.error('Elemento ou conteúdo não encontrado.');
            return;
        }

        const content = element.nextElementSibling;
        const isOpen = content.classList.contains('show');

        // Fecha outros itens abertos no FAQ
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

        // Alterna o item clicado
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

    // Aplica a função toggleElement a todos os elementos do FAQ
    const faqItems = document.querySelectorAll('.faq h3');
    faqItems.forEach((item) => {
        item.addEventListener('click', () => toggleElement(item));
    });

    // Função para o dropdown do avatar
    const profileLink = document.querySelector('.profile-link');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userAvatar = document.querySelector('.user-avatar');
    const profileLinkItem = document.querySelector('#profile-link');
    const loginButton = document.querySelector('.login-button');

    if (profileLink && dropdownMenu && userAvatar) {
        // Alterna o dropdown ao clicar no avatar
        userAvatar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Avatar clicado, toggling dropdown');
            dropdownMenu.classList.toggle('active');

            // Fecha todos os itens do FAQ quando o dropdown é aberto
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

        // Fecha o dropdown se clicar fora dele
        document.addEventListener('click', (e) => {
            if (!profileLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                console.log('Clicado fora do dropdown, fechando');
                dropdownMenu.classList.remove('active');
            }
        });

        // Permite navegação ao clicar no link "Perfil"
        if (profileLinkItem) {
            profileLinkItem.addEventListener('click', (e) => {
                e.preventDefault(); // Impede o comportamento padrão temporariamente
                console.log('Perfil link clicado, navegando para: /cabecalho/perfil.html');
                dropdownMenu.classList.remove('active'); // Fecha o dropdown
                setTimeout(() => {
                    window.location.href = '/cabecalho/perfil.html'; // Navega diretamente
                }, 400); // Atraso para permitir que a animação de fechamento do dropdown termine
            });
        }

        // Função para abrir o modal de logout
        const logoutButton = document.querySelector('#logout-button');
        const logoutModal = document.querySelector('#logout-modal');
        const confirmLogout = document.querySelector('#confirm-logout');
        const cancelLogout = document.querySelector('#cancel-logout');

        if (logoutButton && logoutModal && confirmLogout && cancelLogout) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logout button clicado, abrindo modal');
                dropdownMenu.classList.remove('active'); // Fecha o dropdown
                logoutModal.classList.add('active'); // Abre o modal
            });

            // Confirma o logout
            confirmLogout.addEventListener('click', () => {
                console.log('Logout confirmado');
                if (typeof firebase !== 'undefined') {
                    firebase.auth().signOut().then(() => {
                        window.location.href = '/index.html';
                    }).catch((error) => {
                        console.error('Erro ao fazer logout:', error);
                    });
                } else {
                    console.log('Usuário deslogado');
                    window.location.href = '/index.html';
                }
            });

            // Cancela o logout
            cancelLogout.addEventListener('click', () => {
                console.log('Logout cancelado');
                logoutModal.classList.remove('active'); // Fecha o modal
            });

            // Fecha o modal ao clicar fora dele
            logoutModal.addEventListener('click', (e) => {
                if (e.target === logoutModal) {
                    console.log('Clicado fora do modal, fechando');
                    logoutModal.classList.remove('active');
                }
            });
        }
    }

    // Garante que o botão de login navegue corretamente
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            console.log('Login button clicado, navegando para: /cabecalho/login-cadastro.html');
            // A navegação ocorre normalmente via href, mas podemos forçar se necessário
            setTimeout(() => {
                window.location.href = '/cabecalho/login-cadastro.html';
            }, 100);
        });
    }

    // Lógica de login para mostrar/esconder o avatar
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

    // Lógica do loader
    const loader = document.querySelector('.loader');
    const content = document.querySelector('.content');

    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 1500);
});