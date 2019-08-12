import {createSearchTemplate} from './components/search.js';
import {createMenuTemplate} from './components/menu.js';
import {createProfileRatingTemplate} from './components/rating.js';
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

// Отрисовка карточек
new Array(5).fill(``).forEach(() => render(main, createFilmCardTemplate(), `beforeend`));

// Отрисовка кнопки и попапа
render(main, createShowMoreButtonTemplate(), `beforeend`);
render(main, createFilmPopupTemplate(), `beforeend`);
