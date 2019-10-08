import moment from 'moment';

class ModelFilm {
  constructor(data) {
    this.title = data.film_info.title;
    this.poster = data.film_info.poster;
    this.description = data.film_info.description;
    this.rating = data.film_info.total_rating;
    this.year = moment(data.film_info.release.date).format(`YYYY`);
    this.date = moment(data.film_info.release.date).format(`DD MMMM YYYY`);
    this.hours = parseInt(data.film_info.runtime / 60, 10);
    this.minutes = data.film_info.runtime % 60;
    this.fulltime = data.film_info.runtime;
    this.genre = data.film_info.genre[0];
    this.genres = data.film_info.genre;
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
