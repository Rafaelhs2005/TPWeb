const API_KEY = 'eafe48ecfbfe81be4c93a02eaff882af';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const JSON_SERVER_URL = 'http://localhost:3000/favoritos'; 

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('id');

    if (!seriesId) {
        alert('Série não encontrada!');
        return;
    }

    const seriesDetails = await getSeriesDetails(seriesId);
    const seriesCast = await getSeriesCast(seriesId);

    renderSeriesPoster(seriesDetails); 
    renderSeriesOverview(seriesDetails);
    renderSeriesCast(seriesCast);

    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.addEventListener('click', () => addSeriesToFavorites(seriesDetails));
});

async function getSeriesDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
        return null;
    }
}

async function getSeriesCast(id) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        return data.cast;
    } catch (error) {
        console.error('Erro ao buscar elenco da série:', error);
        return [];
    }
}

function renderSeriesPoster(details) {
    if (!details) return;

    const posterPath = details.poster_path
        ? `${IMAGE_BASE_URL}${details.poster_path}`
        : './assets/img/placeholder.png';

    const posterElement = document.getElementById('series-poster');
    if (posterElement) {
        posterElement.src = posterPath;
        posterElement.alt = details.name || 'Pôster da série';
    }
}

function renderSeriesOverview(details) {
    if (!details) return;

    document.getElementById('series-title').textContent = details.name;
    document.getElementById('series-description').textContent = details.overview || 'Descrição não disponível.';
    document.getElementById('series-details').innerHTML = `
        <li class="list-group-item">Gênero: ${details.genres.map(g => g.name).join(', ')}</li>
        <li class="list-group-item">Data de Lançamento: ${details.first_air_date}</li>
        <li class="list-group-item">Última Temporada: ${details.last_air_date}</li>
        <li class="list-group-item">Total de Episódios: ${details.number_of_episodes}</li>
        <li class="list-group-item">Nota: ${details.vote_average} (${details.vote_count} votos)</li>
    `;
}

function renderSeriesCast(cast) {
    const castContainer = document.getElementById('cast-cards');
    castContainer.innerHTML = '';

    if (cast.length === 0) {
        castContainer.innerHTML = '<p class="text-white">Elenco não disponível.</p>';
        return;
    }

    cast.forEach(member => {
        const card = `
            <div class="col-md-3 mb-4">
                <div class="card">
                    <img src="${member.profile_path ? IMAGE_BASE_URL + member.profile_path : './assets/img/placeholder.png'}" class="card-img-top" alt="${member.name}">
                    <div class="card-body">
                        <h5 class="card-title">${member.name}</h5>
                        <p class="card-text">${member.character || 'Personagem não informado'}</p>
                    </div>
                </div>
            </div>
        `;
        castContainer.innerHTML += card;
    });
}

async function addSeriesToFavorites(series) {
    try {
        const userId = 1; 

        const response = await fetch(JSON_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_serie: series.id,  
                id_usuario: userId,   
            }),
        });

        if (response.ok) {
            alert('Série adicionada aos favoritos!');
        } else {
            alert('Erro ao adicionar aos favoritos.');
        }
    } catch (error) {
        console.error('Erro ao adicionar aos favoritos:', error);
    }
}
