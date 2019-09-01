import {AbstractComponent} from './abstract-component.js';

class NoFilms extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="no-result">
        There is no movies for your request.
      </div>`;
  }
}

export {NoFilms};
