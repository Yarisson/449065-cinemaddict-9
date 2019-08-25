import {createSearchTemplate} from './components/search.js';
import {createMenuTemplate} from './components/menu.js';
import {createProfileRatingTemplate} from './components/rating.js';
import {createFilmsWrapperTemplate} from './components/films.js';
import {createFilmCardTemplate} from './components/film.js';
import {createShowMoreButtonTemplate} from './components/show-more.js';
import {createWrapperPopupTemplate} from './components/popup-wrapper.js';
import {createFilmPopupTemplate} from './components/popup.js';
import {createFooterTemplate} from './components/footer.js';
import {getUser} from './data.js';
import {films} from './data.js';
import {getMenu} from './data.js';
import {extraFilms} from './data.js';
import {extraFilmsIndex} from './data.js';

/**
 * Функция рендера
 */

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Константы
const NUMBER_FILMS_CARD = 5;
const NUMBER_MORE_RENDER_CARDS = 5;

let checkRenderCards = 0;

/**
 * Функция рендера меню
 */

const renderMenu = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getMenu)
    .map(createMenuTemplate)
    .join(``));
};

/**
 * Функция для рендера дополнительных карточек в блоки filmsListsExtra
 */
const renderFilmsExtraLists = () => {
  filmsListsExtra.forEach(function (item) {
    for (let i = 0; i < extraFilmsIndex.length; i++) {
      render(item.querySelector(`.films-list__container`), createFilmCardTemplate(extraFilms[i]), `beforeend`);
      filmCards[i].classList.add(`film-card-extra`);
    }
  });
};

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
// const popupCloseButton = document.querySelector(`.film-details__close-btn`);
const footer = document.querySelector(`.footer`);
let filmCards = document.querySelectorAll(`.film-card`);

// Отрисовка блоков в шапку
render(header, createSearchTemplate(), `beforeend`);
render(header, createProfileRatingTemplate(getUser()), `beforeend`);

// Отрисовка меню
renderMenu(main);
// render(main, createMenuTemplate(), `beforeend`);

// Отрисовка оберток для фильмов
render(main, createFilmsWrapperTemplate(), `beforeend`);

// Отрисовка подвала
render(footer, createFooterTemplate(getMenu()), `beforeend`);

// Поиск элементов в ДОМ-API из отрисованных оберток фильмов
const filmsList = document.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra`);

/**
 * Функция рендера стартовых карточек
 */

const renderFirtsCards = (number) => {
  for (let i = 0; i < number; i++) {
    render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
    filmCards = document.querySelectorAll(`.film-card`);
    checkRenderCards = checkRenderCards + 1;
  }
};

/**
 * Функция обработчиков событий для карточек
 */

const setLisenerOnCards = () => {
  for (let i = 0; i < filmCards.length; i++) {
    filmCards[i].addEventListener(`click`, onFilmCardsClick);
    filmCards[i].querySelector(`img`).setAttribute(`id`, i);
  }

  for (let i = 0; i < filmCardsExtra.length; i++) {
    filmCardsExtra[i].addEventListener(`click`, onFilmCardsExtraClick);
    filmCardsExtra[i].querySelector(`img`).setAttribute(`id`, i);
  }
};

// Отрисовка карточек
renderFirtsCards(NUMBER_FILMS_CARD);
renderFilmsExtraLists();

const filmCardsExtra = document.querySelectorAll(`.film-card-extra`);

// Отрисовка кнопки и попапа
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);
render(main, createWrapperPopupTemplate(), `beforeend`);
const filmDetails = document.querySelector(`.film-details`);
render(filmDetails, createFilmPopupTemplate(films[0]), `beforeend`);

/**
 * Функция обработки клика на кнопку для закрытия попапа
 */

const onPopupButtonClick = () => {
  const filmDetailsInner = filmDetails.querySelector(`.film-details__inner`);
  filmDetails.removeChild(filmDetailsInner);
  filmDetails.style.display = `none`;
  filmDetails.removeEventListener(`click`, onPopupButtonClick);
};

/**
 * Функция показа дополнительных карточек
 */

function onShowMoreButtonClick() {
  const currentNumberCards = checkRenderCards;
  let storedCard = films.length - currentNumberCards;
  if (storedCard === 0) {
    filmsListShowMore.style.display = `none`;
  } else if (storedCard < NUMBER_MORE_RENDER_CARDS - 1) {
    filmsListShowMore.style.display = `none`;
    for (let i = currentNumberCards; i < (films.length); i++) {
      render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
      filmCards = document.querySelectorAll(`.film-card`);
      checkRenderCards = checkRenderCards + 1;
    }
  } else {
    for (let i = currentNumberCards; i < (currentNumberCards + NUMBER_FILMS_CARD); i++) {
      render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
      filmCards = document.querySelectorAll(`.film-card`);
      checkRenderCards = checkRenderCards + 1;
    }
  }
  setLisenerOnCards();
}

/**
 * Функция обработки клика на каточку
 */

const onFilmCardsClick = (evt) => {
  render(filmDetails, createFilmPopupTemplate(films[evt.target.id]), `beforeend`);
  filmDetails.style.display = `block`;
  filmDetails.addEventListener(`click`, onPopupButtonClick);
  // popupCloseButton.addEventListener(`click`, onPopupButtonClick);
};

const onFilmCardsExtraClick = (evt) => {
  render(filmDetails, createFilmPopupTemplate(extraFilms[evt.target.id]), `beforeend`);
  filmDetails.style.display = `block`;
  filmDetails.addEventListener(`click`, onPopupButtonClick);
  // popupCloseButton.addEventListener(`click`, onPopupButtonClick);
};

const filmsListShowMore = document.querySelector(`.films-list__show-more`);

filmsListShowMore.addEventListener(`click`, onShowMoreButtonClick);
setLisenerOnCards();
