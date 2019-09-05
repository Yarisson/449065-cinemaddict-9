import {AbstractComponent} from './abstract-component.js';

class Footer extends AbstractComponent {
  constructor({allFilms}) {
    super();
    this._allFilms = allFilms;
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
