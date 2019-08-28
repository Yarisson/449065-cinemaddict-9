import {createElement} from '../utils.js';

class ShowMore {
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
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export {ShowMore};
