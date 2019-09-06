import {Search} from '../components/search.js';
import {Sort} from '../components/sort.js';
import {Menu} from '../components/menu.js';
import {Footer} from '../components/footer.js';
import {Rating} from '../components/rating.js';
import {FilmsWrapper} from '../components/films.js';
import {Film} from '../components/film.js';
import {NoFilms} from '../components/no-films.js';
import {Popup} from '../components/popup.js';
import {ShowMore} from '../components/show-more.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class PageController {
  constructor(containerHeader, containerMain, containerFooter, ratingMock, menuMock, footerMock, filmMocks, extraFilmMocks) {
    this._containerMain = containerMain;
    this._containerHeader = containerHeader;
    this._containerFooter = containerFooter;
    this._search = new Search();
    this._rating = new Rating(ratingMock);
    this._menu = new Menu(menuMock);
    this._sort = new Sort();
    this._filmsWrapper = new FilmsWrapper();
    this._footerClass = new Footer(footerMock);
    this._filmMocks = filmMocks;
    this._extraFilmMocks = extraFilmMocks;
    this._noFilms = new NoFilms();
    this._showMore = new ShowMore();
    this._checkRenderCards = 0;
    this._NUMBER_MORE_RENDER_CARDS = 5;
  }

  init() {

    // Отрисовка блоков поиска, рейтинга пользователя, меню, обертки для фильмов и подвала
    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    render(this._containerHeader, this._rating.getElement(), position.BEFOREEND);
    render(this._containerMain, this._menu.getElement(), position.BEFOREEND);
    render(this._containerMain, this._sort.getElement(), position.BEFOREEND);
    render(this._containerMain, this._filmsWrapper.getElement(), position.BEFOREEND);
    render(this._containerFooter, this._footerClass.getElement(), position.BEFOREEND);

    // Поиск элементов в ДОМ-API
    const filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    const filmsListsExtra = this._filmsWrapper.getElement().querySelectorAll(`.films-list--extra`);

    /**
      * Функция рендера карточки фильма
    */

    const renderFilm = (filmMock, container) => {
      const film = new Film(filmMock);
      const popup = new Popup(filmMock);
      const popupRenderElements = [];

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

      popup.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

      popup.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      const popupRender = () => {
        unrender(popup.getElement());
        render(this._containerMain, popup.getElement(), position.BEFOREEND);
        document.addEventListener(`keydown`, onEscKeyDown);
        document.addEventListener(`click`, closePopup);
      };

      popupRenderElements.push(film.getElement().querySelector(`.film-card__poster`));
      popupRenderElements.push(film.getElement().querySelector(`.film-card__title`));
      popupRenderElements.push(film.getElement().querySelector(`.film-card__comments`));

      popupRenderElements.forEach(function (item) {
        item.addEventListener(`click`, () => {
          popupRender();
        });
      });

      render(container, film.getElement(), position.BEFOREEND);
    };

    /**
      * Функция рендера нескольких карточек
    */

    const renderFilmCards = (number) => {
      const startIndex = this._checkRenderCards;
      if (this._filmMocks.length === 0) {
        render(filmsList.querySelector(`.films-list__container`), this._noFilms.getElement(), position.BEFOREEND);
      } else {
        for (let i = startIndex; i < (startIndex + number); i++) {
          renderFilm(this._filmMocks[i], filmsList.querySelector(`.films-list__container`));
          this._checkRenderCards = this._checkRenderCards + 1;
        }
      }
    };

    /**
      * Функция рендера extra карточек
    */

    const renderExtraCards = () => {
      if (this._filmMocks.length === 0) {
        return;
      } else {
        const extraMocks = this._extraFilmMocks;
        filmsListsExtra.forEach(function (item) {
          for (let i = 0; i < extraMocks.length; i++) {
            renderFilm(extraMocks[i], item.querySelector(`.films-list__container`));
          }
        });
      }
    };

    /**
      * Функция для рендера кнопки show more
    */

    const renderShowMore = () => {

      this._showMore.getElement()
      .addEventListener(`click`, () => {
        const currentNumberCards = this._checkRenderCards;
        let storedCard = this._filmMocks.length - currentNumberCards;
        if (storedCard === 0) {
          this._showMore.getElement().style.display = `none`;
        } else if (storedCard < this._NUMBER_MORE_RENDER_CARDS) {
          renderFilmCards(storedCard);
          this._showMore.getElement().style.display = `none`;
        } else {
          renderFilmCards(this._NUMBER_MORE_RENDER_CARDS);
        }
      });

      render(filmsList, this._showMore.getElement(), position.BEFOREEND);
    };

    // Отрисовка карточек фильмов и кнопки show more
    renderFilmCards(this._NUMBER_MORE_RENDER_CARDS);
    renderExtraCards();
    renderShowMore();

    this._sort.getElement()
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      filmsList.querySelector(`.films-list__container`).innerHTML = ``;

      if (evt.target.textContent.substring(8) === `date`) {
        const sortedByDateFilms = this._filmMocks.slice().sort((a, b) => a.year - b.year);
        sortedByDateFilms.forEach((filmMock) => renderFilm(filmMock, filmsList.querySelector(`.films-list__container`)));
        this._checkRenderCards = sortedByDateFilms.length;
      } else if (evt.target.textContent.substring(8) === `rating`) {
        const sortedByRatingFilms = this._filmMocks.slice().sort((a, b) => a.rating - b.rating);
        sortedByRatingFilms.forEach((filmMock) => renderFilm(filmMock, filmsList.querySelector(`.films-list__container`)));
        this._checkRenderCards = sortedByRatingFilms.length;
      } else {
        const sortedByDefault = this._filmMocks;
        sortedByDefault.forEach((filmMock) => renderFilm(filmMock, filmsList.querySelector(`.films-list__container`)));
        this._checkRenderCards = sortedByDefault.length;
      }

    });
  }
}

export {PageController};
