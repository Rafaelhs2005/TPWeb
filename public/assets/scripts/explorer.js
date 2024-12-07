const API_KEY = 'eafe48ecfbfe81be4c93a02eaff882af';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const popularSeries = await getPopularSeries();
    renderSeriesCards(popularSeries);

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            const series = await searchSeries(query);
            renderSeriesCards(series);
        }
    });
});

async function getPopularSeries() {
    try {
        const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar séries populares:', error);
        return [];
    }
}

async function searchSeries(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
        return [];
    }
}


function renderSeriesCards(series) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = ''; 

    if (series.length === 0) {
        searchResults.innerHTML = '<p class="text-center text-white">Nenhuma série encontrada.</p>';
        return;
    }

    series.forEach(serie => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${serie.poster_path ? IMAGE_BASE_URL + serie.poster_path : './assets/img/placeholder.png'}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text">${serie.overview ? serie.overview.substring(0, 100) + '...' : 'Descrição não disponível.'}</p>
                        <a href="detalhes.html?id=${serie.id}" class="btn btn-primary">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
        searchResults.innerHTML += card;
    });
}
