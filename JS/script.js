document.addEventListener('DOMContentLoaded', () => {
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
            console.log('Avatar clicado, toggling dropdown');
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
                console.log('Clicado fora do dropdown, fechando');
                dropdownMenu.classList.remove('active');
            }
        });


        if (profileLinkItem) {
            profileLinkItem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Perfil link clicado, navegando para: /cabecalho/perfil.html');
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
                console.log('Logout button clicado, abrindo modal');
                dropdownMenu.classList.remove('active');
                logoutModal.classList.add('active');
            });


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


            cancelLogout.addEventListener('click', () => {
                console.log('Logout cancelado');
                logoutModal.classList.remove('active');
            });

            logoutModal.addEventListener('click', (e) => {
                if (e.target === logoutModal) {
                    console.log('Clicado fora do modal, fechando');
                    logoutModal.classList.remove('active');
                }
            });
        }
    }

    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            console.log('Login button clicado, navegando para: /cabecalho/login-cadastro.html');
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

    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 1500);
});