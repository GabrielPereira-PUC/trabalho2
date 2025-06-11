async function carregarFilmes() {
  try {
    const res = await fetch('http://localhost:3000/filmes');
    const filmes = await res.json();
    exibirFilmes(filmes);
  } catch (erro) {
    console.error("Erro ao carregar filmes:", erro);
  }
}

function exibirFilmes(filmes) {
  const container = document.querySelector("#todos-filmes .row");
  if (!container) return;

  container.innerHTML = "";

  filmes.forEach(filme => {
    const imagem = Array.isArray(filme.imagens) ? filme.imagens[0] : filme.imagens.split(',')[0];
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card bg-dark text-white h-100">
          <a href="detalhes.html?filme=${filme.id}">
            <img src="${imagem.trim()}" class="card-img-top" style="height: 300px;" alt="${filme.titulo}">
          </a>
          <div class="card-body d-flex flex-column">
            <h3 class="card-title">${filme.titulo}</h3>
            <p class="card-text">${filme.sinopse}</p>
            <div class="mt-auto">
              <button class="btn btn-danger">Comprar Ingresso</button>
              <button class="btn btn-outline-warning">&#9733;</button>
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

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("detalhes.html")) {
    carregarDetalhesFilme();
  } else {
    carregarFilmes();
  }
});


const barraPesquisa = document.getElementById('barra-pesquisa');
const containerFilmes = document.querySelector('#todos-filmes .row');
let todosOsFilmes = []; // Armazena os filmes carregados do JSON

// Função para renderizar os filmes
function renderizarFilmes(lista) {
  containerFilmes.innerHTML = '';
  lista.forEach(filme => {
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
    containerFilmes.innerHTML += card;
  });
}


// Carregar os filmes do JSON Server
fetch('http://localhost:3000/filmes')
  .then(res => res.json())
  .then(data => {
    todosOsFilmes = data;
    renderizarFilmes(todosOsFilmes);
  });

// Filtrar os filmes conforme a digitação
barraPesquisa.addEventListener('input', () => {
  const termo = barraPesquisa.value.toLowerCase();
  const filtrados = todosOsFilmes.filter(filme =>
    filme.titulo.toLowerCase().includes(termo)
  );
  renderizarFilmes(filtrados);
});


//editar filme
document.addEventListener('DOMContentLoaded', () => {
  const btnEditar = document.querySelector('a[href="crud.html"]');
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.admin) {
    btnEditar.style.display = 'none';
  }
});

//botao login e logout
const btnLoginLogout = document.querySelector('a[href="login.html"]');
if (usuarioLogado) {
  btnLoginLogout.textContent = "Logout";
  btnLoginLogout.addEventListener('click', () => {
    sessionStorage.removeItem('usuarioLogado');
    location.reload(); // ou redireciona para login.html
  });
} else {
  btnLoginLogout.textContent = "Login";
}
