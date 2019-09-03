import {Search} from '../components/search.js';
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

    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    render(this._containerHeader, this._rating.getElement(), position.BEFOREEND);
    render(this._containerMain, this._menu.getElement(), position.BEFOREEND);
    render(this._containerMain, this._filmsWrapper.getElement(), position.BEFOREEND);
    render(this._containerFooter, this._footerClass.getElement(), position.BEFOREEND);

    const filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    const filmsListsExtra = this._filmsWrapper.getElement().querySelectorAll(`.films-list--extra`);

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
        render(this._containerMain, popup.getElement(), popup.BEFOREEND);
        document.addEventListener(`keydown`, onEscKeyDown);
        document.addEventListener(`click`, closePopup);
      };

      film.getElement()
      .querySelector(`.film-card__poster`)
      .addEventListener(`click`, () => {
        popupRender();
      });

      film.getElement()
      .querySelector(`.film-card__title`)
      .addEventListener(`click`, () => {
        popupRender();
      });

      film.getElement()
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, () => {
        popupRender();
      });

      render(container, film.getElement(), position.BEFOREEND);
    };

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

    renderFilmCards(this._NUMBER_MORE_RENDER_CARDS);
    renderExtraCards();
    renderShowMore();

  }
}

export {PageController};
