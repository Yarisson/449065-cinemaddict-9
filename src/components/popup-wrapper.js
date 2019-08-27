export const createWrapperPopupTemplate = () => {
  return `<section class="film-details">
  </section>`;
};

import {createElement} from '../utils.js';

class popupWrapper {
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
    return `<section class="film-details">
    </section>`;
  }
}
