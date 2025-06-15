// Chave da API RAWG (usada para acessar os dados dos jogos)
const API_KEY = '8a4f9d5219d8423b8181292043bfcf79';

// Função que busca o jogo quando o botão é clicado
async function procurarJogoAgora() {
  const termoBusca = document.getElementById('search').value.trim();

  if (termoBusca === '') {
    alert('Digite o nome de um jogo para continuar.');
    return;
  }

  // Mostra uma mensagem enquanto carrega
  const resultadoEl = document.querySelector('.resultado-container');
  resultadoEl.innerHTML = '<p>Carregando informações do jogo...</p>';

  console.log('Iniciando busca por:', termoBusca);

  // Espera 1 segundo para simular carregamento
  setTimeout(async () => {
    const urlPesquisa = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(termoBusca)}`;

    try {
      const resposta = await fetch(urlPesquisa);
      const dados = await resposta.json();

      if (!dados.results || dados.results.length === 0) {
        resultadoEl.innerHTML = '<p>Nenhum jogo encontrado com esse nome.</p>';
        return;
      }

      const jogoEscolhido = dados.results[0];
      const idJogo = jogoEscolhido.id;

      const urlDetalhes = `https://api.rawg.io/api/games/${idJogo}?key=${API_KEY}`;
      const respostaDetalhes = await fetch(urlDetalhes);
      const jogoDetalhado = await respostaDetalhes.json();

      console.log('Jogo encontrado:', jogoDetalhado.name);

      // Monta os links
      let linksExtras = '';
      if (jogoDetalhado.website) {
        linksExtras += `<a href="${jogoDetalhado.website}" target="_blank">Site Oficial</a>`;
      }

      if (jogoDetalhado.stores && jogoDetalhado.stores.length > 0) {
        jogoDetalhado.stores.forEach((storeInfo) => {
          if (storeInfo.url && storeInfo.store?.name) {
            linksExtras += `<a href="${storeInfo.url}" target="_blank">${storeInfo.store.name}</a>`;
          }
        });
      }

      // Monta e exibe o resultado final
      const htmlFinal = `
        <h2>${jogoDetalhado.name}</h2>
        <p><strong>Nota:</strong> ${jogoDetalhado.rating}</p>
        <p><strong>Descrição:</strong> ${jogoDetalhado.description_raw}</p>
        ${jogoDetalhado.background_image ? `<img src="${jogoDetalhado.background_image}" alt="${jogoDetalhado.name}" />` : ''}
        <div>${linksExtras}</div>
      `;

      resultadoEl.innerHTML = htmlFinal;

    } catch (erro) {
      console.error('Erro ao buscar os dados:', erro);
      resultadoEl.innerHTML = '<p>Ocorreu um erro. Tente novamente mais tarde.</p>';
    }

  }, 1000);
}
