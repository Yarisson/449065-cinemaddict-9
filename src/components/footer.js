export const createFooterTemplate = ({numberAllFilms}) => {
  return `<section
   class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${numberAllFilms} movies inside</p>
  </section>`;
};

import {createElement} from '../utils.js';

class footer {
  constructor({numberAllFilms}) {
    this._numberAllFilms = numberAllFilms;
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
     <p>${this._numberAllFilms} movies inside</p>
   </section>`;
  }
}
