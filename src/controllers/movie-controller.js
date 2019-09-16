import {Popup} from '../components/popup.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class MovieController {
  constructor(containerMain, data, onDataChange) {
    this._containerMain = containerMain;
    this._data = data;
    this._onDataChange = onDataChange;
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

      const formData = new FormData(popup.getElement().querySelector(`.film-details__inner`));

      const entry = {
        favorites: Boolean(formData.get(`favorite`)),
        watchlist: Boolean(formData.get(`watchlist`)),
        watched: Boolean(formData.get(`watched`)),
      };

      console.log(entry);

      const switchTrueFalse = (bool) => {
        return bool ? false : true;
      };

      const popupFilmControls = [];

      popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--watchlist`));
      popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--watched`));
      popupFilmControls.push(popup.getElement().querySelector(`.film-details__control-label--favorite`));

      popupFilmControls.forEach(function (item) {
        item.addEventListener(`click`, (evt) => {
          console.log(evt.target.dataset.controlType);
          switch (evt.target.dataset.controlType) {
            case `favorites`:
              entry.favorites = switchTrueFalse(entry.favorites);
              break;
            case `watchlist`:
              entry.watchlist = switchTrueFalse(entry.watchlist);
              break;
            case `watched`:
              entry.watched = switchTrueFalse(entry.watched);
              break;
          }

          if (entry.watched) {
            popup.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
            popup.getElement().querySelector(`.film-details__user-rating `).classList.remove(`visually-hidden`);
          } else {
            popup.getElement().querySelector(`.form-details__middle-container `).classList.add(`visually-hidden`);
            popup.getElement().querySelector(`.film-details__user-rating `).classList.add(`visually-hidden`);
          }

          this._onDataChange(entry, this._data);
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

      popupRender();
    };

    renderPopup(this._data, this._containerMain);
  }
}

/**
  *
  *
  * const getNewMokData = (nameOfList) => {
  const switchTrueFalse = (bool) => {
    return bool ? false : true;
  };
  const formData = new FormData(this._popUpFilm.getElement().querySelector(`.film-details__inner`));
  const userRatio = formData.getAll(`score`);
  const entry = {
    favorites: Boolean(formData.get(`favorite`)),
    watchlist: Boolean(formData.get(`watchlist`)),
    watched: Boolean(formData.get(`watched`)),
    userRatio: `Your rate ${userRatio}`,
  };

  switch (nameOfList) {
    case `favorites`:
      entry.favorites = switchTrueFalse(entry.favorites);
      break;
    case `watchlist`:
      entry.watchlist = switchTrueFalse(entry.watchlist);
      break;
    case `watched`:
      entry.watched = switchTrueFalse(entry.watched);
      break;
  }

  if (entry.watched) {
    this._popUpFilm.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
    this._popUpFilm.getElement().querySelector(`.film-details__user-rating `).classList.remove(`visually-hidden`);
  } else {
    this._popUpFilm.getElement().querySelector(`.form-details__middle-container `).classList.add(`visually-hidden`);
    this._popUpFilm.getElement().querySelector(`.film-details__user-rating `).classList.add(`visually-hidden`);
    entry.userRatio = ``;
  }

  this._onDataChange(entry, this._data);
};

*/

export {MovieController};
