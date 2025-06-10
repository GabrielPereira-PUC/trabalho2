const form = document.getElementById("formFilme");
const listaFilmes = document.getElementById("listaFilmes");
const mensagem = document.getElementById("mensagem");

let editandoId = null;

const limparFormulario = () => {
  form.reset();
  editandoId = null;
  document.getElementById("id").readOnly = false;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const filme = {
    id: document.getElementById("id").value.trim().toLowerCase(),
    titulo: document.getElementById("titulo").value,
    diretor: document.getElementById("diretor").value,
    elenco: document.getElementById("elenco").value.split(",").map(e => e.trim()),
    dataLancamento: document.getElementById("dataLancamento").value,
    generos: document.getElementById("generos").value.split(",").map(g => g.trim()),
    duracao: document.getElementById("duracao").value,
    sinopse: document.getElementById("sinopse").value,
    nota: parseFloat(document.getElementById("nota").value.replace(",", ".")),
    imagens: document.getElementById("imagens").value.split(",").map(img => img.trim()),
    paisOrigem: document.getElementById("paisOrigem").value.trim()  // <-- aqui
  };

  try {
    const url = `http://localhost:3000/filmes${editandoId ? "/" + editandoId : ""}`;
    const metodo = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filme)
    });

    if (res.ok) {
      mensagem.innerHTML = `<div class="alert alert-success">Filme ${editandoId ? "atualizado" : "cadastrado"} com sucesso!</div>`;
      limparFormulario();
      carregarFilmes();
    } else {
      mensagem.innerHTML = `<div class="alert alert-danger">Erro ao salvar filme.</div>`;
    }
  } catch (error) {
    mensagem.innerHTML = `<div class="alert alert-danger">Erro: ${error}</div>`;
  }
});

const carregarFilmes = async () => {
  listaFilmes.innerHTML = "";
  const res = await fetch("http://localhost:3000/filmes");
  const filmes = await res.json();

  filmes.forEach(filme => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    card.innerHTML = `
          <div class="card bg-secondary text-white h-100">
            <div class="card-body">
              <h5 class="card-title">${filme.titulo}</h5>
              <p class="card-text">${filme.sinopse.slice(0, 100)}...</p>
              <button class="btn btn-sm btn-warning me-2" onclick="editarFilme('${filme.id}')">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="excluirFilme('${filme.id}')">Excluir</button>
            </div>
          </div>
        `;
    listaFilmes.appendChild(card);
  });
};

window.editarFilme = async (id) => {
  const res = await fetch(`http://localhost:3000/filmes/${id}`);
  const filme = await res.json();

  document.getElementById("id").value = filme.id;
  document.getElementById("id").readOnly = true;
  document.getElementById("titulo").value = filme.titulo;
  document.getElementById("diretor").value = filme.diretor;
  document.getElementById("elenco").value = filme.elenco.join(", ");
  document.getElementById("dataLancamento").value = filme.dataLancamento;
  document.getElementById("paisOrigem").value = filme.paisOrigem;
  document.getElementById("generos").value = filme.generos.join(", ");
  document.getElementById("duracao").value = filme.duracao;
  document.getElementById("sinopse").value = filme.sinopse;
  document.getElementById("nota").value = filme.nota;
  document.getElementById("imagens").value = filme.imagens.join(", ");

  editandoId = id;
  mensagem.innerHTML = `<div class="alert alert-info">Editando o filme <strong>${filme.titulo}</strong>.</div>`;
};

window.excluirFilme = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este filme?")) return;

  const res = await fetch(`http://localhost:3000/filmes/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    mensagem.innerHTML = `<div class="alert alert-warning">Filme excluído com sucesso.</div>`;
    carregarFilmes();
  } else {
    mensagem.innerHTML = `<div class="alert alert-danger">Erro ao excluir filme.</div>`;
  }
};

carregarFilmes();