export const createProfileRatingTemplate = ({status}) => {
  return `<section
   class="header__profile profile">
  <p class="profile__rating">${status}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

import {createElement} from '../utils.js';

class rating {
  constructor({status}) {
    this._status = status;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<section
    class="header__profile profile">
   <p class="profile__rating">${this._status}</p>
   <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
   </section>`;
  }
}
