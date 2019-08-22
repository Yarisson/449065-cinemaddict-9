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
const renderFilmCard = (container, count, index) => {
  container.insertAdjacentHTML(`beforeend`,
   new Array(count)
    .fill(films[index])
//    .map(films[count])
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
const renderFilmsExtraLists = (index1, index2) => {
  filmsListsExtra.forEach(function (item) {
    render(item.querySelector(`.films-list__container`), createFilmCardTemplate(films[index1]), `beforeend`);
    render(item.querySelector(`.films-list__container`), createFilmCardTemplate(films[index2]), `beforeend`);
//    renderFilmCard(item.querySelector(`.films-list__container`), NUMBER_EXTRA_FILMS_CARD);
  });
};

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const popupCloseButton = document.querySelector('.film-details__close-btn');
let filmCards = document.querySelectorAll('.film-card');

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
for (let i = 0; i < NUMBER_FILMS_CARD; i++) {
  render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}
renderFilmsExtraLists(5, 9);


// Отрисовка кнопки и попапа
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
render(main, createFilmPopupTemplate(), `beforeend`);

const filmDetails = document.querySelector('.film-details');
const onPopupButtonClick = () => {
  filmDetails.style.display = "none";
};

function onShowMoreButtonClick() {
  filmCards = document.querySelectorAll('.film-card');
  if (films.length - filmCards.length > 5) {
    for (let i = filmCards.length; i < (filmCards.length + NUMBER_FILMS_CARD); i++) {
      render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
    } 
  } else if (films.length - filmCards.length > 0) {
      for (let i = filmCards.length; i < films.length; i++) {
        render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
      }
    } else {
      filmsListShowMore.style.disabled = "true";
    }
} 

const onFilmCardsClick = () => {
  filmDetails.style.display = "block";
  popupCloseButton.addEventListener('click', onPopupButtonClick);
};

const filmsListShowMore = document.querySelector('.films-list__show-more');

filmsListShowMore.addEventListener('click', onShowMoreButtonClick);
filmDetails.addEventListener('click', onPopupButtonClick);
for (let i=0; i < filmCards.length; i++) {
  filmCards[i].addEventListener('click', onFilmCardsClick);
}