import {createElement} from '../utils.js';

class Footer {
  constructor({allFilms}) {
    this._allFilms = allFilms;
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
    class="footer__logo logo logo--smaller">Cinemaddict</section>
   <section class="footer__statistics">
     <p>${this._allFilms} movies inside</p>
   </section>`;
  }
}

export {Footer};
