import {Film} from '../components/film.js';
import {Popup} from '../components/popup.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class PageController {
  constructor(container, containerMain, filmMock) {
    this._container = container;
    this._containerMain = containerMain;
    this._film = new Film(filmMock);
    this._popup = new Popup(filmMock);
  }

  init() {

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(this._popup.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const closePopup = () => {
      this._popup.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, () => {
        unrender(this._popup.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
    };

    this._popup.getElement().querySelector(`.film-details__comment-input`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._popup.getElement().querySelector(`.film-details__comment-input`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const popupRender = () => {
      unrender(this._popup.getElement());
      render(this._containerMain, this._popup.getElement(), this._popup.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    };

    this._film.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, () => {
      popupRender();
    });

    this._film.getElement()
    .querySelector(`.film-card__title`)
    .addEventListener(`click`, () => {
      popupRender();
    });

    this._film.getElement()
    .querySelector(`.film-card__comments`)
    .addEventListener(`click`, () => {
      popupRender();
    });

    render(this._container, this._film.getElement(), position.BEFOREEND);
  }
}

export {PageController};
