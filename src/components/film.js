import {AbstractComponent} from './abstract-component.js';

class Film extends AbstractComponent {
  constructor({title, poster, description, rating, year, numberComments, hours, minutes, genre, favorites, watchlist, watched, id}) {
    super();
    this._title = title;
    this._poster = poster;
    this._description = description;
    this._rating = rating;
    this._year = year;
    this._numberComments = numberComments;
    this._hours = hours;
    this._minutes = minutes;
    this._genre = genre;
    this._favorites = favorites;
    this._watchlist = watchlist;
    this._watched = watched;
    this._id = id;
  }

  getTemplate() {
    return `<article
   class="film-card">
  <h3 class="film-card__title" name="title">${this._title}</h3>
  <p class="film-card__rating" name="rating">${this._rating}</p>
  <p class="film-card__info">
    <span class="film-card__year" name="year">${this._year}</span>
    <span class="film-card__duration" name="time">${this._hours}h ${this._minutes}m</span>
    <span class="film-card__genre" name="genre">${this._genre}</span>
  </p>
  <img src="${this._poster}" alt="" name="image" class="film-card__poster">
  <p class="film-card__description" name="description">${this._description}</p>
  <a class="film-card__comments" name="numberComments">${this._numberComments} comments</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${(this._watchlist) ? `film-card__controls-item--active` : ``}" name="_watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${(this._watched) ? `film-card__controls-item--active` : ``}" name="_watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${(this._favorites) ? `film-card__controls-item--active` : ``}" name="_favorites">Mark as favorite</button>
  </form>
  </article>`;
  }
}

export {Film};
