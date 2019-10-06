import {AbstractComponent} from './abstract-component.js';

class Menu extends AbstractComponent {
  constructor(watchlist, history, favorites) {
    super();
    this._watchlist = watchlist;
    this._history = history;
    this._favorites = favorites;
  }

  getTemplate() {
    return `<nav
    class="main-navigation">
   <a href="#all" id="all" class="main-navigation__item">All movies</a>
   <a href="#watchlist" id="watchlist-menu" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this._watchlist}</span></a>
   <a href="#history" id="history" class="main-navigation__item">History <span class="main-navigation__item-count">${this._history}</span></a>
   <a href="#favorites" id="favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this._favorites}</span></a>
   <a href="#stats" id="stats" class="main-navigation__item main-navigation__item--additional main-navigation__item--active">Stats</a>
   </nav>`;
  }
}

export {Menu};
