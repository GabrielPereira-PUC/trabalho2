document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const isCadastro = window.location.pathname.includes('cadastro.html');
    const apiURL = 'http://localhost:3000/usuarios';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            alert('Preencha todos os campos.');
            return;
        }

        if (isCadastro) {
            const nome = document.getElementById('nome').value.trim();
            const confirmar = document.getElementById('confirmar').value.trim();

            if (!nome || !confirmar) {
                alert('Preencha todos os campos.');
                return;
            }

            if (senha !== confirmar) {
                alert('As senhas não coincidem.');
                return;
            }

            try {
                // Verifica se o e-mail já existe
                const res = await fetch(`${apiURL}?email=${email}`);
                const usuarios = await res.json();

                if (usuarios.length > 0) {
                    alert('E-mail já cadastrado.');
                    return;
                }

                // Cria novo usuário
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
                    alert('Cadastro realizado com sucesso!');
                    window.location.href = 'login.html';
                } else {
                    alert('Erro ao cadastrar usuário.');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                alert('Erro na comunicação com o servidor.');
            }
        } else {
            try {
                const res = await fetch(`${apiURL}?email=${email}&senha=${senha}`);
                const usuarios = await res.json();

                if (usuarios.length === 0) {
                    alert('E-mail ou senha inválidos.');
                    return;
                }

                const usuario = usuarios[0];

                // Salva no sessionStorage
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

                alert('Login bem-sucedido!');
                window.location.href = 'index.html'; // Redirecione para a página principal
            } catch (error) {
                console.error('Erro no login:', error);
                alert('Erro na comunicação com o servidor.');
            }
        }
    });
});
