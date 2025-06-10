async function carregarDados() {
  const resposta = await fetch('http://localhost:3000/filmes');
  const filmes = await resposta.json();

  const generoContagem = {};
  const generoNotas = {};

  filmes.forEach(filme => {
    const nota = parseFloat(filme.nota);
    filme.generos.forEach(genero => {
      generoContagem[genero] = (generoContagem[genero] || 0) + 1;
      generoNotas[genero] = generoNotas[genero] || [];
      generoNotas[genero].push(nota);
    });
  });

  const generos = Object.keys(generoContagem);
  const qtdPorGenero = generos.map(g => generoContagem[g]);
  const mediaPorGenero = generos.map(g => {
    const notas = generoNotas[g];
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    return parseFloat(media.toFixed(1));
  });

  // Gráfico de Pizza
  new Chart(document.getElementById('pizzaGenero'), {
    type: 'pie',
    data: {
      labels: generos,
      datasets: [{
        label: 'Filmes por Gênero',
        data: qtdPorGenero,
        backgroundColor: ['#dc3545', '#ffc107', '#0d6efd', '#6610f2', '#198754', '#6c757d', '#fd7e14']
      }]
    }
  });
}
carregarDados();
