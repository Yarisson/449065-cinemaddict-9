import {createElement} from '../utils.js';

class NoFilms {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<div class="no-result">
        There is no movies for your request.
      </div>`;
  }
}

export {NoFilms};
