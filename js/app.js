const API_KEY = '47b48e11-6502-49ef-bc4b-03f3c4e6be02';
const API_URL_POPULAR =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`;
const API_URL_MOVIE_DETAILS =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const resData = await res.json();
  showMovies(resData);
  console.log(resData);
}

function getClassByRating(rating) {
  if (rating >= 7.5 || rating >= '75%') {
    return 'green';
  } else if (rating > 5 || rating >= '50%') {
    return 'orange';
  } else {
    return 'red';
  }
}

function NormalizeRating(rating) {
  if (rating.length > 3) {
    return '?';
  }
  return rating;
}

function showMovies(data) {
  const moviesElem = document.querySelector('.movies');

  document.querySelector('.movies').innerHTML = '';

  data.films.forEach((movie) => {
    const movieElem = document.createElement('div');
    movieElem.classList.add('movie');
    movieElem.innerHTML = `
      <div class="movie__cover-inner">
        <img
        src="${movie.posterUrlPreview}"
        alt="${movie.nameRu}"
        class="movie__cover"
        width="256"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`,
        )}
        </div>
      ${
        movie.rating &&
        `
        <div class="movie__average movie__average--${getClassByRating(
          movie.rating,
        )}">
        ${NormalizeRating(movie.rating)}
        </div>
  `
      }
      </div>
  `;
    movieElem.addEventListener('click', () => openModal(movie.filmId));
    moviesElem.appendChild(movieElem);
  });
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = '';
  }
});

// Modal

const modalEl = document.querySelector('.modal');

async function openModal(id) {
  const res = await fetch(API_URL_MOVIE_DETAILS + id, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const resData = await res.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');

  modalEl.innerHTML = `
  <div class="modal__card">
    <img class="modal__movie-backdrop" src="${resData.posterUrlPreview}" alt="${
    resData.nameRu
  }" />
    <h2>
      <span class="modal__movie-title">${resData.nameRu}</span>
      <span class="modal__movie-releaase-year">- ${resData.year}</span>
    </h2>
    <ul class="modal__movie-info">
      <div class="loader"></div>
      <li class="modal__movie-genre">Жанр: ${resData.genres.map(
        (el) => `<span>${el.genre}</span>`,
      )}</li>
      ${
        resData.filmLength
          ? `<li class="modal__movie-runtime">Время - ${resData.filmLength} мин</li>`
          : ''
      }
      <li>Сайт: <a href="${resData.webUrl}" class="modal__movie-site">${
    resData.webUrl
  }</a></li>
      <li class="modal__movie-overview">Описание - ${resData.description}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
  </div>
`;

  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});
