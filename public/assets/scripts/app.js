const API_KEY = 'eafe48ecfbfe81be4c93a02eaff882af'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const FAVORITES_URL = 'http://localhost:3000/favoritos';  // URL para acessar as séries favoritas no JSONServer
const SERIES_URL = 'http://localhost:3000/series';        // URL para acessar a lista de séries no JSONServer

document.addEventListener('DOMContentLoaded', () => {
    renderPopularSeries();
    renderNewSeries();
    loadAuthorInfo();
    loadFavoriteSeries();  // Carregar as séries favoritas assim que a página for carregada
});

// Função para buscar as séries populares
async function fetchPopularSeries() {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data.results;
}

// Função para buscar as séries novas
async function fetchNewSeries() {
    const response = await fetch(`${BASE_URL}/tv/latest?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data.results;
}

// Função para renderizar as séries populares no carrossel
async function renderPopularSeries() {
    const popularSeries = await fetchPopularSeries();
    const carouselContent = document.getElementById('popularCarouselContent');

    popularSeries.forEach((series, index) => {
        const isActive = index === 0 ? 'active' : '';
        const item = `
            <div class="carousel-item ${isActive}">
                <img src="${IMAGE_BASE_URL}${series.backdrop_path}" class="d-block w-100" alt="${series.name}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${series.name}</h5>
                    <p>${series.overview || 'Descrição não disponível.'}</p>
                </div>
            </div>
        `;
        carouselContent.innerHTML += item;
    });
}

// Função para renderizar as séries novas
async function renderNewSeries() {
    const newSeries = await fetchNewSeries();  // Agora está chamando fetchNewSeries()
    const cardsContainer = document.getElementById('new-series-cards');

    newSeries.slice(0, 6).forEach(series => {
        const card = `
            <div class="col">
                <div class="card">
                    <img src="${IMAGE_BASE_URL}${series.poster_path}" class="card-img-top" alt="${series.name}">
                    <div class="card-body">
                        <h5 class="card-title">${series.name}</h5>
                        <p class="card-text">${series.overview || 'Descrição não disponível.'}</p>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
}

// Função para carregar as informações do autor
function loadAuthorInfo() {
    fetch("http://localhost:3000/usuarios/1")
        .then((response) => response.json())
        .then((author) => {
            const authorInfo = `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${author.nome}</h5>
                        <p class="card-text">${author.biografia}</p>
                        <p><strong>Curso:</strong> ${author.curso}</p>
                        <p><strong>Email:</strong> ${author.email}</p>
                        <div class="d-flex justify-content-around">
                            <a href="${author.linkFacebook}" target="_blank" class="btn btn-primary">Facebook</a>
                            <a href="${author.linkTwitter}" target="_blank" class="btn btn-info">Twitter</a>
                            <a href="${author.linkInstagram}" target="_blank" class="btn btn-danger">Instagram</a>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("author-info").innerHTML = authorInfo;
        })
        .catch((error) => console.error("Erro ao carregar informações do autor:", error));
}

// Função para buscar e carregar as séries favoritas
async function loadFavoriteSeries() {
    try {
        // Buscar as séries favoritas no JSONServer
        const response = await fetch(FAVORITES_URL);
        const favoriteSeriesData = await response.json();

        // Para cada série favorita, buscar os detalhes
        const favoriteSeries = await Promise.all(favoriteSeriesData.map(async (favorite) => {
            const seriesResponse = await fetch(`${SERIES_URL}/${favorite.id_serie}`);
            return seriesResponse.json();
        }));

        // Renderizar as séries favoritas na tela
        renderFavoriteSeries(favoriteSeries);
    } catch (error) {
        console.error('Erro ao carregar séries favoritas:', error);
    }
}

// Função para renderizar as séries favoritas na tela
function renderFavoriteSeries(series) {
    const container = document.getElementById('favorite-series-cards');
    container.innerHTML = ''; // Limpar qualquer conteúdo existente

    series.forEach(serie => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text">${serie.overview.substring(0, 100)}...</p>
                        <a href="detalhes.html?id=${serie.id}" class="btn btn-primary">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
