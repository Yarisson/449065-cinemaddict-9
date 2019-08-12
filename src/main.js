import {createSearchTemplate} from './components/search.js';
import {createMenuTemplate} from './components/menu.js';
import {createProfileRatingTemplate} from './components/rating.js';
import {createFilmsWrapperTemplate} from './components/films.js';
import {createFilmCardTemplate} from './components/film.js';
import {createShowMoreButtonTemplate} from './components/showmore.js';
import {createFilmPopupTemplate} from './components/popup.js';
// функция рендера
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// константы
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

// Отрисовка блоков в шапку
render(header, createSearchTemplate(), `beforeend`);
render(header, createProfileRatingTemplate(), `beforeend`);

// Отрисовка меню
render(main, createMenuTemplate(), `beforeend`);

// Отрисовка оберток для фильмов
render(main, createFilmsWrapperTemplate(), `beforeend`);

const filmsList = document.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);
// const filmsListExtra = document.querySelectorAll(`.films-list--extra`);
// const filmsListExtraContainer = filmsListExtra.querySelectorAll(`.films-list__container`);

// Отрисовка карточек
new Array(5).fill(``).forEach(() => render(filmsListContainer, createFilmCardTemplate(), `beforeend`));
// new Array(2).fill(``).forEach(() => render(filmsListExtraContainer, createFilmCardTemplate(), `beforeend`));

// Отрисовка кнопки и попапа
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
render(main, createFilmPopupTemplate(), `beforeend`);
