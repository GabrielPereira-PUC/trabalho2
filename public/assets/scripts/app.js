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
