import {Popup} from '../components/popup.js';
import {Comment} from '../components/comment.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';
import {getCommentaries} from '../data.js';

class MovieController {
  constructor(containerMain, data, onDataChange, onChangeView) {
    this._containerMain = containerMain;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._popup = new Popup(data);
    this._commentData = getCommentaries;
    this._dataComments = data.comments;
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

    const popupFilmControls = [];

    popupFilmControls.push(popup.getElement().querySelector(`#watchlist`));
    popupFilmControls.push(popup.getElement().querySelector(`#watched`));
    popupFilmControls.push(popup.getElement().querySelector(`#favorite`));
    popupFilmControls.forEach((item) => {

      item.addEventListener(`click`, (evt) => {
        this._getNewMokData(evt.target.id);
      });
    });


    popup.getElement().querySelector(`.film-details__comment-input`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, (evt) => this._createEschandler(popup, evt));
    });

    popup.getElement().querySelector(`.film-details__comment-input`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, (evt) => this._createEschandler(popup, evt));
    });

    const emoji = [];
    emoji.push(popup.getElement().querySelector(`#emoji-smile`));
    emoji.push(popup.getElement().querySelector(`#emoji-sleeping`));
    emoji.push(popup.getElement().querySelector(`#emoji-angry`));
    emoji.push(popup.getElement().querySelector(`#emoji-gpuke`));

    emoji.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        const test = popup.getElement().querySelector(`.film-details__add-emoji-label`);
        const newEmoji = popup.getElement().querySelector(`.film-details__emoji-list label[for="${evt.target.id}"] img`);
        test.innerHTML = ``;
        test.append(newEmoji.cloneNode(true));
      });
    });

    popup.getElement().querySelector(`.film-details__comment-input`).addEventListener(`change`, (evt) => {
      const commentsContainer = popup.getElement().querySelector(`.film-details__comments-list`);
      const commentText = evt.target.value;
      const commentImgContainer = popup.getElement().querySelector(`.film-details__add-emoji-label`);
      const commentImg = commentImgContainer.querySelector(`img`).src;
      this._renderComment(commentsContainer, commentImg, commentText);
    });

    popup.getElement().addEventListener(`change`, () => {
      // this._getNewMokData();
      popup.getElement().querySelector(`.film-details__user-rating`).textContent = this._data.userRating;
      popup.getElement().querySelector(`.film-details__comments-count`).textContent = this._data.comments.length;
    });

    this._deleteComment();

    this._popupRender(container);
  }

  _createEschandler(popup, evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, () => this._createEschandler(popup, evt));
    }
  }

  _closePopup(popup) {
    popup.getElement()
    .querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, (evt) => {
      unrender(popup.getElement());
      document.removeEventListener(`keydown`, () => this._createEschandler(popup, evt));
    });
  }

  _popupRender(container) {
    unrender(this._popup.getElement());
    this._onChangeView();
    render(container, this._popup.getElement(), position.BEFOREEND);
    document.addEventListener(`keydown`, (evt) => this._createEschandler(this._popup, evt));
    document.addEventListener(`click`, this._closePopup(this._popup));
  }

  _getNewMokData() {
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userRating = formData.getAll(`score`);
    const entry = {
      id: this._data.id,
      favorite: (formData.get(`favorite`)),
      watchlist: (formData.get(`watchlist`)),
      watched: (formData.get(`watched`)),
      userRating: `Your rate ${userRating}`,
      comment: formData.get(`comment`),
    };


    if (entry.watched) {
      this._popup.getElement().querySelector(`.form-details__middle-container `).classList.remove(`visually-hidden`);
      this._popup.getElement().querySelector(`.film-details__user-rating `).classList.remove(`visually-hidden`);
    } else {
      this._popup.getElement().querySelector(`.form-details__middle-container `).classList.add(`visually-hidden`);
      this._popup.getElement().querySelector(`.film-details__user-rating `).classList.add(`visually-hidden`);
    }

    this._onDataChange(entry, this._data);
  }

  _renderComment(container, img, text) {
    const comment = new Comment(this._commentData);
    comment._emoji = img;
    comment._text = text;
    render(container, comment.getElement(), position.BEFOREEND);
    const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
    const userRating = formData.getAll(`score`);

    const entry = {
      id: this._data.id,
      favorite: Boolean(formData.get(`favorite`)),
      watchlist: Boolean(formData.get(`watchlist`)),
      watched: Boolean(formData.get(`watched`)),
      userRating: `Your rate ${userRating}`,
      comment: {
        emoji: img,
        text: comment._text,
        author: ``,
        day: ``,
      },
    };
    this._onDataChange(entry, this._data);
  }

  _deleteComment() {
    this._popup.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const currentComment = evt.target.closest(`.film-details__comment`);
        const currentId = currentComment.id;
        unrender(currentComment);
        this._dataComments.splice(currentId, 1);

        const formData = new FormData(this._popup.getElement().querySelector(`.film-details__inner`));
        const userRating = formData.getAll(`score`);

        const entry = {
          id: this._data.id,
          favorite: Boolean(formData.get(`favorite`)),
          watchlist: Boolean(formData.get(`watchlist`)),
          watched: Boolean(formData.get(`watched`)),
          userRating: `Your rate ${userRating}`,
          comment: null,
          commentId: currentId
        };

        this._onDataChange(entry, this._data);
        this._popup.getElement().querySelector(`.film-details__comments-count`).textContent = this._dataComments.length;
      });
    });
  }
}

export {MovieController};
