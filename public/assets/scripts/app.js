let todosOsFilmes = [];

async function carregarFilmes() {
  try {
    const res = await fetch('http://localhost:3000/filmes');
    const filmes = await res.json();
    todosOsFilmes = filmes;
    renderizarFilmes(filmes);
  } catch (erro) {
    console.error("Erro ao carregar filmes:", erro);
  }
}

function renderizarFilmes(lista) {
  const container = document.querySelector("#todos-filmes .row");
  if (!container) return;

  container.innerHTML = '';

  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

  lista.forEach(filme => {
    const imagem = Array.isArray(filme.imagens)
      ? filme.imagens[0]
      : filme.imagens?.split(',')[0] || 'images/sem-imagem.png';

    const jaFavorito = usuario?.favoritos?.includes(filme.id);

    const card = `
      <div class="col-md-4 mb-4">
        <div class="card h-100 bg-dark text-white">
          <a href="detalhes.html?filme=${filme.id}">
            <img src="${imagem.trim()}" class="card-img-top" alt="${filme.titulo}" style="height: 300px;">
          </a>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${filme.titulo}</h5>
            <p class="card-text">${filme.sinopse || ''}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <a href="detalhes.html?filme=${filme.id}" class="btn btn-danger">Ver detalhes</a>
              <button class="btn btn-outline-warning btn-favorito ${jaFavorito ? 'favoritado' : ''}" data-id="${filme.id}">&#9733;</button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

function alterarConteudo(filme) {
  document.getElementById("titulo").textContent = filme.titulo;
  document.getElementById("diretor").textContent = filme.diretor;
  document.getElementById("elenco").textContent = filme.elenco.join(", ");
  document.getElementById("data-lancamento").textContent = filme.dataLancamento;
  document.getElementById("local-de-origem").textContent = filme.paisOrigem || "Desconhecido";
  document.getElementById("genero").textContent = filme.generos.join(", ");
  document.getElementById("duracao").textContent = filme.duracao;
  document.getElementById("sinopse").textContent = filme.sinopse;
  document.getElementById("nota").textContent = filme.nota;

  const fotosItem = document.getElementById("fotos-item");
  if (!fotosItem) return;

  fotosItem.innerHTML = "";
  filme.imagens.forEach(imagem => {
    const cardItem = `
      <div class="col">
        <div class="card">
          <img src="${imagem}" style="height: 300px;" class="card-img-top" alt="${filme.titulo}">
        </div>
      </div>
    `;
    fotosItem.innerHTML += cardItem;
  });
}

async function carregarDetalhesFilme() {
  try {
    const res = await fetch('http://localhost:3000/filmes');
    const filmes = await res.json();
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('filme');
    const filme = filmes.find(f => f.id === id);
    if (filme) alterarConteudo(filme);
    else console.error("Filme não encontrado");
  } catch (error) {
    console.error("Erro ao carregar detalhes:", error);
  }
}

async function carregarFavoritos() {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  const container = document.querySelector("#favoritos .row");
  if (!container) return;

  if (!usuario || !usuario.favoritos || usuario.favoritos.length === 0) {
    container.innerHTML = "<p class='text-white'>Nenhum filme favorito encontrado.</p>";
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/filmes');
    const filmes = await res.json();
    const favoritos = filmes.filter(f => usuario.favoritos.includes(f.id));

    container.innerHTML = "";
    favoritos.forEach(filme => {
      const imagem = Array.isArray(filme.imagens)
        ? filme.imagens[0]
        : filme.imagens?.split(',')[0] || 'images/sem-imagem.png';

      const card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100 bg-dark text-white">
            <a href="detalhes.html?filme=${filme.id}">
              <img src="${imagem.trim()}" class="card-img-top" alt="${filme.titulo}" style="height: 300px;">
            </a>
            <div class="card-body">
              <h5 class="card-title">${filme.titulo}</h5>
              <p class="card-text">${filme.sinopse || ''}</p>
              <a href="detalhes.html?filme=${filme.id}" class="btn btn-danger">Ver detalhes</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (erro) {
    console.error("Erro ao carregar filmes favoritos:", erro);
  }
}

// Pesquisa de filmes
const barraPesquisa = document.getElementById('barra-pesquisa');
if (barraPesquisa) {
  barraPesquisa.addEventListener('input', () => {
    const termo = barraPesquisa.value.toLowerCase();
    const filtrados = todosOsFilmes.filter(filme =>
      filme.titulo.toLowerCase().includes(termo)
    );
    renderizarFilmes(filtrados);
  });
}

// Controle de exibição do botão editar e login/logout
document.addEventListener('DOMContentLoaded', () => {
  const btnEditar = document.querySelector('a[href="crud.html"]');
  const btnLoginLogout = document.querySelector('a[href="login.html"]');
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

  if (btnEditar && (!usuarioLogado || !usuarioLogado.admin)) {
    btnEditar.style.display = 'none';
  }

  if (btnLoginLogout) {
    if (usuarioLogado) {
      btnLoginLogout.textContent = "Logout";
      btnLoginLogout.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('usuarioLogado');
        location.reload();
      });
    } else {
      btnLoginLogout.textContent = "Login";
    }
  }

  const path = window.location.pathname;

  if (path.includes("detalhes.html")) {
    carregarDetalhesFilme();
  } else if (path.includes("favoritos.html")) {
    carregarFavoritos();
  } else {
    carregarFilmes();
  }
});

// Favoritar/desfavoritar filme
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-favorito')) {
    const idFilme = e.target.dataset.id;
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    if (!usuario) {
      alert("Você precisa estar logado para favoritar filmes.");
      return;
    }

    const jaFavoritado = usuario.favoritos.includes(idFilme);
    const novosFavoritos = jaFavoritado
      ? usuario.favoritos.filter(id => id !== idFilme)
      : [...usuario.favoritos, idFilme];

    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favoritos: novosFavoritos })
      });

      if (resposta.ok) {
        usuario.favoritos = novosFavoritos;
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        e.target.classList.toggle('favoritado');
      }
    } catch (erro) {
      console.error('Erro ao atualizar favoritos:', erro);
    }
  }
});
