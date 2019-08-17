import {createSearchTemplate} from './components/search.js';
import {createMenuTemplate} from './components/menu.js';
import {createProfileRatingTemplate} from './components/rating.js';
import {createFilmsWrapperTemplate} from './components/films.js';
import {createFilmCardTemplate} from './components/film.js';
import {createShowMoreButtonTemplate} from './components/show-more.js';
import {createFilmPopupTemplate} from './components/popup.js';

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
 * Функция для рендера дополнительных карточек в блоки filmsListsExtra
 */
const renderFilmsExtraLists = () => {
  filmsListsExtra.forEach(function (item) {
    return Array(NUMBER_EXTRA_FILMS_CARD).fill(``).forEach(() => render(item.querySelector(`.films-list__container`), createFilmCardTemplate(), `beforeend`));
  });
};

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Отрисовка блоков в шапку
render(header, createSearchTemplate(), `beforeend`);
render(header, createProfileRatingTemplate(), `beforeend`);

// Отрисовка меню
render(main, createMenuTemplate(), `beforeend`);

// Отрисовка оберток для фильмов
render(main, createFilmsWrapperTemplate(), `beforeend`);

// Поиск элементов в ДОМ-API из отрисованных оберток фильмов
const filmsList = document.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra`);

// Отрисовка карточек
new Array(NUMBER_FILMS_CARD).fill(``).forEach(() => render(filmsListContainer, createFilmCardTemplate(), `beforeend`));
renderFilmsExtraLists();

// Отрисовка кнопки и попапа
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
render(main, createFilmPopupTemplate(), `beforeend`);
