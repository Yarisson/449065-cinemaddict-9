import {Search} from './components/search.js';
import {Menu} from './components/menu.js';
import {Rating} from './components/rating.js';
import {FilmsWrapper} from './components/films.js';
import {Film} from './components/film.js';
import {ShowMore} from './components/show-more.js';
import {Popup} from './components/popup.js';
import {Footer} from './components/footer.js';

import {getFilmsAll} from './data.js';
import {getUser} from './data.js';
import {films} from './data.js';
import {getMenu} from './data.js';
import {extraFilms} from './data.js';

import {position} from './utils.js';
import {render} from './utils.js';
import {unrender} from './utils.js';

// Константы
const NUMBER_FILMS_CARD = 5;
const NUMBER_MORE_RENDER_CARDS = 5;

// счетчик количества отрендеренных карточек
let checkRenderCards = 0;


// моковые данные для рандер функций
const filmMocks = films;
const extraFilmMocks = extraFilms;
const menuMocks = new Array(1).fill(``).map(getMenu);
const ratingMocks = new Array(1).fill(``).map(getUser);
const footerMocks = new Array(1).fill(``).map(getFilmsAll);

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

/**
 * Функция рендера поиска
 */

const renderSearch = (searchMock) => {
  const search = new Search(searchMock);

  render(header, search.getElement(), position.BEFOREEND);
};

/**
 * Функция рендера блока рейтинга пользователя
 */

const renderRating = (ratingMock) => {
  const rating = new Rating(ratingMock);

  render(header, rating.getElement(), position.BEFOREEND);
};

/**
 * Функция рендера меню
 */

const renderMenu = (menuMock) => {
  const menu = new Menu(menuMock);

  render(main, menu.getElement(), position.BEFOREEND);
};

/**
 * Функция рендера обертки фильмов
 */

const renderFilmsWrapper = (filmsWrapperMock) => {
  const filmsWrapper = new FilmsWrapper(filmsWrapperMock);

  render(main, filmsWrapper.getElement(), position.BEFOREEND);
};

/**
 * Функция рендера подвала
 */

const renderFooter = (footerMock) => {
  const footerClass = new Footer(footerMock);

  render(footer, footerClass.getElement(), position.BEFOREEND);
};

// рендер больших блоков, на основе функций рендера описанных выше
renderSearch();
ratingMocks.forEach((ratingMock) => renderRating(ratingMock));
menuMocks.forEach((menuMock) => renderMenu(menuMock));
renderFilmsWrapper();
footerMocks.forEach((footerMock) => renderFooter(footerMock));

// Поиск элементов в ДОМ-API из отрисованных оберток фильмов
const filmsList = document.querySelector(`.films-list`);
const filmsListsExtra = document.querySelectorAll(`.films-list--extra`);

/**
 * Функция рендера карточки
 */

const renderFilm = (filmMock, container) => {
  const film = new Film(filmMock);
  const popup = new Popup(filmMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const closePopup = () => {
    popup.getElement()
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, () => {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
  };

  film.getElement()
  .querySelector(`.film-card__poster`)
  .addEventListener(`click`, () => {
    if (popup.getElement()) {
      unrender(popup.getElement());
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`click`, closePopup);
      document.addEventListener(`keydown`, onEscKeyDown);
    } else {
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    }
  });

  film.getElement()
  .querySelector(`.film-card__title`)
  .addEventListener(`click`, () => {
    if (popup.getElement()) {
      unrender(popup.getElement());
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    } else {
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    }
  });

  film.getElement()
  .querySelector(`.film-card__comments`)
  .addEventListener(`click`, () => {
    if (popup.getElement()) {
      unrender(popup.getElement());
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    } else {
      render(main, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    }
  });

  render(container, film.getElement(), position.BEFOREEND);
};

/**
 * Функция рендера нескольких карточек
 */

const renderFilmCards = (number) => {
  const startIndex = checkRenderCards;
  for (let i = startIndex; i < (startIndex + number); i++) {
    renderFilm(filmMocks[i], filmsList.querySelector(`.films-list__container`));
    checkRenderCards = checkRenderCards + 1;
  }
};

const renderExtraCards = () => {
  filmsListsExtra.forEach(function (item) {
    for (let i = 0; i < extraFilms.length; i++) {
      renderFilm(extraFilmMocks[i], item.querySelector(`.films-list__container`));
    }
  });
};

/**
 * Функция для рендера кнопки show more
 */

const renderShowMore = (showMoreMock) => {
  const showMore = new ShowMore(showMoreMock);

  showMore.getElement()
  .addEventListener(`click`, () => {
    const currentNumberCards = checkRenderCards;
    let storedCard = films.length - currentNumberCards;
    if (storedCard === 0) {
      showMore.getElement().style.display = `none`;
    } else if (storedCard < NUMBER_MORE_RENDER_CARDS) {
      renderFilmCards(storedCard);
      showMore.getElement().style.display = `none`;
    } else {
      renderFilmCards(NUMBER_MORE_RENDER_CARDS);
    }
  });

  render(filmsList, showMore.getElement(), position.BEFOREEND);
};

// Отрисовка карточек
renderFilmCards(NUMBER_FILMS_CARD);
renderExtraCards();

// Отрисовка кнопки show more
renderShowMore();
