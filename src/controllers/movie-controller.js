import {Popup} from '../components/popup.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class MovieController {
  constructor(containerMain, data, onDataChange, onChangeView) {
    this._containerMain = containerMain;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._popup = new Popup(data);
  }

  setDefaultView() {
    if (this._containerMain.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
    }
  }

  init() {
    this._renderPopup(this._containerMain);
  }

  _renderPopup(container) {
    const popup = this._popup;

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        unrender(popup.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const popupFilmControls = [];

    popupFilmControls.push(popup.getElement().querySelector(`#watchlist`));
    popupFilmControls.push(popup.getElement().querySelector(`#watched`));
    popupFilmControls.push(popup.getElement().querySelector(`#favorite`));

    popupFilmControls.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        this._getNewMokData(evt.target.id);
        console.log(`click`);
      });
    });

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
      this._onChangeView();
      render(container, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    };

    popup.getElement().addEventListener(`change`, () => {
      this._getNewMokData();
      popup.getElement().querySelector(`.film-details__user-rating`).textContent = this._data.userRating;
    });

    popupRender();
  }

  _getNewMokData(nameOfList) {
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userRating = formData.getAll(`score`);
    const entry = {
      id: this._data.id,
      favorite: Boolean(formData.get(`favorite`)),
      watchlist: Boolean(formData.get(`watchlist`)),
      watched: Boolean(formData.get(`watched`)),
      userRating: `Your rate ${userRating}`,
    };

    entry[nameOfList] = !entry[nameOfList];

    if (entry.watched) {
      this._popup.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
      this._popup.getElement().querySelector(`.film-details__user-rating `).classList.remove(`visually-hidden`);
    } else {
      this._popup.getElement().querySelector(`.form-details__middle-container `).classList.add(`visually-hidden`);
      this._popup.getElement().querySelector(`.film-details__user-rating `).classList.add(`visually-hidden`);
    }

    this._onDataChange(entry, this._data);
  }
}


export {MovieController};
