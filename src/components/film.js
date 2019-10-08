import {AbstractComponent} from './abstract-component.js';

class Film extends AbstractComponent {
  constructor({title, poster, description, rating, year, comments, hours, minutes, genre, genres, favorite, watchlist, watched, id}) {
    super();
    this._title = title;
    this._poster = poster;
    this._description = description;
    this._rating = rating;
    this._year = year;
    this._comments = comments;
    this._hours = hours;
    this._minutes = minutes;
    this._genre = genre;
    this._genres = genres;
    this._favorite = favorite;
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
    <span class="film-card__genre" name="genre">${this._genre} ${(this._genres.length > 1) ? this._genres : this._genre}</span>
  </p>
  <img src="${this._poster}" alt="" name="image" class="film-card__poster">
  <p class="film-card__description" name="description">${this._description}</p>
  <a class="film-card__comments" name="numberComments">${this._comments.length} comments</a>
  <form class="film-card__controls" name="id">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${(this._watchlist) ? `film-card__controls-item--active` : ``}" name="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${(this._watched) ? `film-card__controls-item--active` : ``}" name="watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${(this._favorite) ? `film-card__controls-item--active` : ``}" name="favorite">Mark as favorite</button>
  </form>
  </article>`;
  }
}

export {Film};
