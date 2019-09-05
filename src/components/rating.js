import {AbstractComponent} from './abstract-component.js';

class Rating extends AbstractComponent {
  constructor({status}) {
    super();
    this._status = status;
  }

  getTemplate() {
    return `<section
    class="header__profile profile">
   <p class="profile__rating">${this._status}</p>
   <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
   </section>`;
  }
}

export {Rating};
