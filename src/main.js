import {createSearchTemplate} from './components/search.js';
import {createMenuTemplate} from './components/menu.js';
import {createProfileRatingTemplate} from './components/rating.js';
import {createFilmsWrapperTemplate} from './components/films.js';
import {createFilmCardTemplate} from './components/film.js';
import {createShowMoreButtonTemplate} from './components/show-more.js';
import {createFilmPopupTemplate} from './components/popup.js';
import {getUser} from './data.js';
import {getCard} from './data.js';
import {films} from './data.js';
import {getAllFilms} from './data.js';
import {getFilmsAll} from './data.js';

/**
 * Функция рендера
 */
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Константы
const NUMBER_FILMS_CARD = 5;
const NUMBER_EXTRA_FILMS_CARD = 2;

/**
 * Функция для рендера карточек после добавления данных внутрь шаблона
 */
const renderFilmCard = (container, count) => {
  container.insertAdjacentHTML(`beforeend`, new Array(count)
    .fill(``)
    .map(films[count])
    .map(createFilmCardTemplate)
    .join(``));
};

const renderProfileRating = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getUser)
    .map(createProfileRatingTemplate)
    .join(``));
};

const renderMenu = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getUser)
    .map(getFilmsAll)
    .map(createMenuTemplate)
    .join(``));
};

/**
 * Функция для рендера дополнительных карточек в блоки filmsListsExtra
 */
const renderFilmsExtraLists = () => {
  filmsListsExtra.forEach(function (item) {
    renderFilmCard(item.querySelector(`.films-list__container`), NUMBER_EXTRA_FILMS_CARD);
  });
};

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Отрисовка блоков в шапку
render(header, createSearchTemplate(), `beforeend`);
renderProfileRating(header);
// render(header, createProfileRatingTemplate(), `beforeend`);

// Отрисовка меню
renderMenu(main);
// render(main, createMenuTemplate(), `beforeend`);

// Отрисовка оберток для фильмов
render(main, createFilmsWrapperTemplate(), `beforeend`);

// Поиск элементов в ДОМ-API из отрисованных оберток фильмов
const filmsList = document.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra`);

// Отрисовка карточек
renderFilmCard(filmsListContainer, NUMBER_FILMS_CARD);
renderFilmsExtraLists();

// Отрисовка кнопки и попапа
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
render(main, createFilmPopupTemplate(), `beforeend`);
