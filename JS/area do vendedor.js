document.addEventListener('DOMContentLoaded', () => {
    // --------- FORMULÁRIO DE PACOTES DE VIAGEM ---------
    const form = document.getElementById('travel-package-form');
    const packagesList = document.getElementById('packages-list');
    const feedbackDiv = document.getElementById('feedback');
    let currentEditRow = null;

    function isValidPrice(price) {
        return /^\d+(\.\d{1,2})?$/.test(price);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const destinos = document.getElementById('destinos').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const dataInicio = document.getElementById('dataInicio').value;
        const dataTermino = document.getElementById('dataTermino').value;
        const localizacao = document.getElementById('localizacao').value.trim();
        const preco = document.getElementById('preco').value.trim();
        const imagem = document.getElementById('imagem').files[0];
        const duracao = document.getElementById('duracao').value.trim();
        const vagas = document.getElementById('vagas').value.trim();

        if (!destinos || !descricao || !dataInicio || !dataTermino || !localizacao ||
            !isValidPrice(preco) || !duracao || !vagas || !imagem) {
            feedbackDiv.innerHTML = '<p class="validacao">Por favor, preencha todos os campos corretamente.</p>';
            return;
        }

        if (currentEditRow) {
            currentEditRow.innerHTML = `
                <td>${destinos}</td>
                <td>${dataInicio} - ${dataTermino}</td>
                <td>R$ ${parseFloat(preco).toFixed(2)}</td>
                <td>
                    <button onclick="editPackage(this)">Editar</button>
                    <button onclick="deletePackage(this)">Excluir</button>
                </td>
            `;
            feedbackDiv.innerHTML = '<p class="validacao2">Pacote atualizado com sucesso!</p>';
        } else {
            const packageRow = document.createElement('tr');
            packageRow.innerHTML = `
                <td>${destinos}</td>
                <td>${dataInicio} - ${dataTermino}</td>
                <td>R$ ${parseFloat(preco).toFixed(2)}</td>
                <td>
                    <button onclick="editPackage(this)">Editar</button>
                    <button onclick="deletePackage(this)">Excluir</button>
                </td>
            `;
            packagesList.appendChild(packageRow);
            feedbackDiv.innerHTML = '<p class="validacao2">Pacote adicionado com sucesso!</p>';
        }

        form.reset();
        currentEditRow = null;
    });

    window.editPackage = function (button) {
        const row = button.parentElement.parentElement;
        const cells = row.getElementsByTagName('td');
        document.getElementById('destinos').value = cells[0].innerText;
        const dates = cells[1].innerText.split(' - ');
        document.getElementById('dataInicio').value = dates[0].trim();
        document.getElementById('dataTermino').value = dates[1].trim();
        document.getElementById('preco').value = cells[2].innerText.replace('R$ ', '').trim();
        currentEditRow = row;
        document.getElementById('destinos').focus();
    };

    window.deletePackage = function (button) {
        const row = button.parentElement.parentElement;
        row.remove();
        feedbackDiv.innerHTML = '<p class="validacao2">Pacote excluído com sucesso!</p>';
    };

    // --------- ÁREA DO VENDEDOR (FAQ, MENU, LOGIN, LOGOUT ETC.) ---------
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

