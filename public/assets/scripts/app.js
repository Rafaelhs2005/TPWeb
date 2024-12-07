const API_KEY = 'eafe48ecfbfe81be4c93a02eaff882af'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const FAVORITES_URL = 'http://localhost:3000/favoritos';  
const SERIES_URL = 'http://localhost:3000/series';       

const USER_ID = 1; 

document.addEventListener('DOMContentLoaded', () => {
    renderPopularSeries();
    renderNewSeries();
    loadAuthorInfo();
    loadFavoriteSeries(USER_ID); 
});

async function fetchPopularSeries() {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data.results;
}

async function fetchNewSeries() {
    const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=pt-BR&page=1`);
    const data = await response.json();
    return data.results;
}


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

async function renderNewSeries() {
    const newSeries = await fetchNewSeries();  
    const cardsContainer = document.getElementById('new-series-cards');

    newSeries.slice(0, 6).forEach(series => {
        const card = `
            <div class="col">
                <div class="card">
                    <img src="${IMAGE_BASE_URL}${series.poster_path}" class="card-img-top" alt="${series.name}">
                    <div class="card-body">
                        <h5 class="card-title">${series.name}</h5>
                        <p class="card-text">${series.overview || 'Descrição não disponível.'}</p>
                        <a href="detalhes.html?id=${series.id}" class="btn btn-primary">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.innerHTML += card;
    });
}

function loadAuthorInfo() {
    fetch("http://localhost:3000/usuarios/1")
        .then((response) => response.json())
        .then((author) => {
            const authorInfo = `
                <div class="card" style="width: 18rem;">
                    <img src="${'./assets/img/eu.jpeg'}" class="card-img-top" alt="Avatar do autor">
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



async function loadFavoriteSeries(userId) {
    try {
        const response = await fetch(FAVORITES_URL);
        const favoriteSeriesData = await response.json();

        console.log('Dados dos favoritos:', favoriteSeriesData); 

        const userFavorites = favoriteSeriesData.filter(favorite => favorite.id_usuario === userId);

        console.log('Favoritos do usuário:', userFavorites); 

        const favoriteSeries = await Promise.all(userFavorites.map(async (favorite) => {
            const seriesResponse = await fetch(`${BASE_URL}/tv/${favorite.id_serie}?api_key=${API_KEY}&language=pt-BR`);
            
            if (!seriesResponse.ok) {
                console.error('Erro ao buscar série:', seriesResponse.status); 
                return null;
            }

            const seriesData = await seriesResponse.json();
            console.log('Dados da série:', seriesData);  
            return seriesData;
        }));

        const validSeries = favoriteSeries.filter(series => series !== null);

        renderFavoriteSeries(validSeries);
    } catch (error) {
        console.error('Erro ao carregar séries favoritas:', error);
    }
}


function renderFavoriteSeries(series) {
    const container = document.getElementById('favorite-series-cards');
    container.innerHTML = ''; 

    if (series.length === 0) {
        container.innerHTML = '<p class="text-center text-white">Nenhuma série favorita.</p>';
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
        container.innerHTML += card;
    });
}
