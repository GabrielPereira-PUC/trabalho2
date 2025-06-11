document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded acionado');

    const form = document.querySelector('form');
    console.log('Form encontrado?', form);

    const isCadastro = window.location.pathname.includes('cadastro.html');
    const apiURL = 'http://localhost:3000/usuarios';

    const exibirMensagem = (mensagem, tipo = 'success') => {
        const alertExistente = form.querySelector('.alert');
        if (alertExistente) alertExistente.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo}`;
        alertDiv.textContent = mensagem;
        alertDiv.style.marginTop = '10px';
        form.appendChild(alertDiv);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // impede o reload

        console.log('Submit capturado');

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
                const res = await fetch(`${apiURL}?email=${encodeURIComponent(email)}`);
                const usuarios = await res.json();

                if (usuarios.length > 0) {
                    exibirMensagem('E-mail já cadastrado.', 'danger');
                    return;
                }

                const novoUsuario = { nome, email, senha, admin: false, favoritos: [] };

                const resposta = await fetch(apiURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoUsuario)
                });

                if (resposta.ok) {
                    window.location.href = 'login.html';
                } else {
                    exibirMensagem('Erro ao cadastrar usuário.', 'danger');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                exibirMensagem('Erro na comunicação com o servidor.', 'danger');
            }
        } else {
            try {
                const res = await fetch(`${apiURL}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
                const usuarios = await res.json();

                if (usuarios.length === 0) {
                    exibirMensagem('E-mail ou senha inválidos.', 'danger');
                    return;
                }

                const usuario = usuarios[0];
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                    window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro no login:', error);
                exibirMensagem('Erro na comunicação com o servidor.', 'danger');
            }
        }
    });
});
