import {AbstractComponent} from './abstract-component.js';

class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`;
  }
}

export {Sort};
