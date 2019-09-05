import {AbstractComponent} from './abstract-component.js';

class ShowMore extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export {ShowMore};
