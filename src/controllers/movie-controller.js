import {Popup} from '../components/popup.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';
import {PageController} from './page-controller.js';

class MovieController {
  constructor(containerMain, data, onDataChange, onChangeView) {
    this._containerMain = containerMain;
    this._data = data;
    this._onDataChange = PageController.onDataChange();
    // Не понимаю как правильно нужно вытаскивать onDataChange ?
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = onChangeView;
  }

  init() {

    /**
      * Функция рендера карточки фильма
    */

    const renderPopup = (filmMock, container) => {
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
        render(container, popup.getElement(), position.BEFOREEND);
        document.addEventListener(`keydown`, onEscKeyDown);
        document.addEventListener(`click`, closePopup);
        this._onDataChange();
      };

      popupRender();
    };

    renderPopup(this._data, this._containerMain);
  }
}

export {MovieController};
