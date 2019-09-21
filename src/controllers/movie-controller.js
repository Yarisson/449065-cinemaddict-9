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
    if (document.body.contains(this._popup.getElement())) {
      unrender(this._popup.getElement());
      this._popup.removeElement();
    }
  }

  init() {

    /**
      * Функция рендера карточки фильма
    */

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

    popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--watchlist`));
    popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--watched`));
    popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--favorite`));

    popupFilmControls.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        // console.log(evt.target.dataset.controlType);
        console.log(`${evt.target.dataset.controlType}`);
        this._getNewMokData(`${evt.target.dataset.controlType}`);
        // this._getNewMokData(evt.target.dataset.controlType);
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
      render(container, popup.getElement(), position.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`click`, closePopup);
    };

    popup.getElement().addEventListener(`change`, (evt) => {
      this._getNewMokData(`${evt.target.dataset.controlType}`);
    });

    popupRender();
  }

  _getNewMokData(nameOfList) {
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userRating = formData.getAll(`score`);
    const switchTrueFalse = (bool) => {
      return bool ? false : true;
    };
    const entry = {
      favorites: Boolean(formData.get(`favorites`)),
      watchlist: Boolean(formData.get(`watchlist`)),
      watched: Boolean(formData.get(`watched`)),
      userRating: `Your rate ${userRating}`,
    };

    console.log(Boolean(formData.get(`favorite`)));
    // switch (nameOfList) {
      // case `nameOfList`:
        // entry[nameOfList] = switchTrueFalse(entry[nameOfList]);
        // break;
    // }

    if (nameOfList === `favorites`) {
      entry.favorites = switchTrueFalse(entry.favorites);
    } else if (nameOfList === `watchlist`) {
      entry.watchlist = switchTrueFalse(entry.watchlist);
    } else if (nameOfList === `watched`) {
      entry.watched = switchTrueFalse(entry.watched);
    }

    // if (entry.watched) {
      // this._popup.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
      // this._popup.getElement().querySelector(`.film-details__user-rating `).classList.remove(`visually-hidden`);
    // } else {
      // this._popup.getElement().querySelector(`.form-details__middle-container `).classList.add(`visually-hidden`);
      // this._popup.getElement().querySelector(`.film-details__user-rating `).classList.add(`visually-hidden`);
      // entry.userRating = ``;
    // }

    // console.log(entry);
    this._onDataChange(entry, this._data);
    // unrender(this._popup.getElement());
    // this._renderPopup(this._containerMain);
  }
}

// const formData = new FormData(film.getElement().querySelector(`.film-card__controls`));
// const entry = {
  // _watchlist: Boolean(formData.get(`_watchlist`)),
  // _watched: Boolean(formData.get(`_watched`)),
  // _favorites: Boolean(formData.get(`_favorites`)),
// };

export {MovieController};
