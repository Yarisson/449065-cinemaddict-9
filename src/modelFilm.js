import moment from 'moment';

class ModelFilm {
  constructor(data) {
    this.title = data.film_info.title;
    this.poster = data.film_info.poster;
    this.description = data.film_info.description;
    this.rating = data.film_info.total_rating;
    this.date = moment(data.film_info.release.date).format(`DD MMMM YYYY`);
    this.hours = moment(data.film_info.release.runtime).format(`hh`);
    this.minutes = moment(data.film_info.release.runtime).format(`mm`);
    this.genre = data.film_info.genre;
    this.favorite = data.user_details.favorite;
    this.watchlist = data.user_details.watchlist;
    this.watched = data.user_details.already_watched;
    this.userRating = data.user_details.personal_rating;
    this.id = data.id;
    this.comments = data.comments;
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }
}

export {ModelFilm};
