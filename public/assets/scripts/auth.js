document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const isCadastro = window.location.pathname.includes('cadastro.html');
    const apiURL = 'http://localhost:3000/usuarios';

    const exibirMensagem = (mensagem, tipo = 'success') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo}`;
        alertDiv.textContent = mensagem;
        alertDiv.style.marginTop = '10px';
        form.appendChild(alertDiv);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            exibirMensagem('Preencha todos os campos.', 'warning');
            return;
        }

        if (isCadastro) {
            const nome = document.getElementById('nome').value.trim();
            const confirmar = document.getElementById('confirmar').value.trim();

            if (!nome || !confirmar) {
                exibirMensagem('Preencha todos os campos.', 'warning');
                return;
            }

            if (senha !== confirmar) {
                exibirMensagem('As senhas não coincidem.', 'danger');
                return;
            }

            try {
                const res = await fetch(`${apiURL}?email=${email}`);
                const usuarios = await res.json();

                if (usuarios.length > 0) {
                    exibirMensagem('E-mail já cadastrado.', 'danger');
                    return;
                }

                const novoUsuario = {
                    nome,
                    email,
                    senha,
                    admin: false,
                    favoritos: []
                };

                const resposta = await fetch(apiURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                });

                if (resposta.ok) {
                    exibirMensagem('Conta criada com sucesso! Redirecionando para o login...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    exibirMensagem('Erro ao cadastrar usuário.', 'danger');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                exibirMensagem('Erro na comunicação com o servidor.', 'danger');
            }
        } else {
            try {
                const res = await fetch(`${apiURL}?email=${email}&senha=${senha}`);
                const usuarios = await res.json();

                if (usuarios.length === 0) {
                    exibirMensagem('E-mail ou senha inválidos.', 'danger');
                    return;
                }

                const usuario = usuarios[0];
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

                exibirMensagem('Login bem-sucedido! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                console.error('Erro no login:', error);
                exibirMensagem('Erro na comunicação com o servidor.', 'danger');
            }
        }
    });
});
