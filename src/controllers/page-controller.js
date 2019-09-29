import {Search} from '../components/search.js';
import {Sort} from '../components/sort.js';
import {Menu} from '../components/menu.js';
import {Footer} from '../components/footer.js';
import {Rating} from '../components/rating.js';
import {FilmsWrapper} from '../components/films.js';
import {Film} from '../components/film.js';
import {NoFilms} from '../components/no-films.js';
import {ShowMore} from '../components/show-more.js';
import {Statistic} from '../components/statistic.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';
import {MovieController} from './movie-controller.js';

const SortHandlers = {
  'date': (arr) => arr.sort((a, b) => b.year - a.year),
  'rating': (arr) => arr.sort((a, b) => b.rating - a.rating),
  'default': (arr) => arr.sort((a, b) => a - b),
  'comments': (arr) => arr.sort((a, b) => b.comments.length - a.comments.length),
};

class PageController {

  constructor(containerHeader, containerMain, containerFooter, ratingData, statisticData, footerData, filmsData, WatchlistData, HistoryData, FavoritesData) {
    this._containerMain = containerMain;
    this._containerHeader = containerHeader;
    this._containerFooter = containerFooter;
    this._search = new Search();
    this._rating = new Rating(ratingData);
    this._menu = new Menu(WatchlistData.length, HistoryData.length, FavoritesData.length);
    this._sort = new Sort();
    this._filmsWrapper = new FilmsWrapper();
    this._footerClass = new Footer(footerData);
    this._filmsData = filmsData;
    this._noFilms = new NoFilms();
    this._filmsWatchlist = WatchlistData;
    this._filmsHistory = HistoryData;
    this._filmsFavorites = FavoritesData;
    this._showMore = new ShowMore();
    this._statistic = new Statistic(statisticData);
    this._checkRenderCards = 0;
    this._NUMBER_MORE_RENDER_CARDS = 5;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._currentFilmsList = this._filmsData;
  }

  init() {

    // Отрисовка блоков поиска, рейтинга пользователя, меню, обертки для фильмов и подвала
    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    render(this._containerHeader, this._rating.getElement(), position.BEFOREEND);
    render(this._containerMain, this._menu.getElement(), position.BEFOREEND);
    render(this._containerMain, this._statistic.getElement(), position.BEFOREEND);
    render(this._containerMain, this._sort.getElement(), position.BEFOREEND);
    render(this._containerMain, this._filmsWrapper.getElement(), position.BEFOREEND);
    render(this._containerFooter, this._footerClass.getElement(), position.BEFOREEND);

    // Поиск элементов в ДОМ-API
    this.filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    this.filmsListRate = this._filmsWrapper.getElement().querySelector(`.films-list--rate`);
    this.filmsListComments = this._filmsWrapper.getElement().querySelector(`.films-list--comments`);

    // Отрисовка карточек фильмов и кнопки show more
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
    this._renderExtraCards(this.filmsListRate, this._topRated(this._filmsData, `rating`));
    this._renderExtraCards(this.filmsListComments, this._mostCommented(this._filmsData, `comments`));
    // this._renderExtraCards(this.filmsListComments);
    this._renderShowMore(this._filmsData);

    this._switchStatistic();
    this._changeFilmlist();

    this._sort.getElement()
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      this.filmsList.querySelector(`.films-list__container`).innerHTML = ``;
      this._checkRenderCards = 0;
      this._sort.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      if (evt.target.dataset.sortType === `date`) {
        this._sortArr(this._filmsData, `date`);
      } else if (evt.target.dataset.sortType === `rating`) {
        this._sortArr(this._filmsData, `rating`);
      } else {
        this._sortArr(this._filmsData, `default`);
      }
    });

  }

  _sortArr(arr, by) {
    if (!SortHandlers[by]) {
      throw new Error(`Unknown sort key: ${by}`);
    }

    let sorted = SortHandlers[by](arr.slice(0));
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, sorted, this.filmsList);
    unrender(this._showMore.getElement(this._filmsData));
    this._renderShowMore(sorted);
    return sorted;
  }

  _renderFilm(filmData, container, index) {
    const film = new Film(filmData);
    const popupRenderElements = [];
    const filmControls = [];
    const subscriptions = this._subscriptions;
    const onDataChange = this._onDataChange;
    const onChangeView = this._onChangeView;

    film.getElement().id = index;
    film.getElement().querySelector(`.film-card__controls`).id = index;
    popupRenderElements.push(film.getElement().querySelector(`.film-card__poster`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__title`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__comments`));

    popupRenderElements.forEach(function (item) {
      item.addEventListener(`click`, () => {
        const movieController = new MovieController(container, filmData, onDataChange, onChangeView);
        movieController.init();
        subscriptions.push(movieController.setDefaultView.bind(movieController));
      });
    });

    filmControls.push(film.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`));
    filmControls.push(film.getElement().querySelector(`.film-card__controls-item--mark-as-watched`));
    filmControls.push(film.getElement().querySelector(`.film-card__controls-item--favorite`));

    filmControls.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        console.log(evt.target);
        const formData = new FormData(evt.target.closest(`.film-card__controls`));
        console.log(evt.target.closest(`.film-card`).id);
        // film.getElement().id
        const currentFilmCard = evt.target.closest(`.film-card`);
        const currentFilmCardId = evt.target.closest(`.film-card`).id;
        console.log(currentFilmCard);
        console.log(currentFilmCardId);
        const entry = {
          id: (formData.get(`id`)),
          favorite: Boolean(formData.get(`favorite`)),
          watchlist: Boolean(formData.get(`watchlist`)),
          watched: Boolean(formData.get(`watched`)),
          userRating: ``,
          // comments: this._popup.getElement().querySelectorAll(`.film-details__comment`).length,
        };
        entry[evt.target.name] = !entry[evt.target.name];
        this._onDataChange(entry, this._data);
      });
    });

    render(container, film.getElement(), position.BEFOREEND);
    this._subscriptions = subscriptions;
    // console.log(film._comments);
  }

  _renderFilmCards(number, filmsData, container) {
    const startIndex = this._checkRenderCards;
    if (filmsData.length === 0) {
      render(container.querySelector(`.films-list__container`), this._noFilms.getElement(), position.BEFOREEND);
    } else {
      for (let i = startIndex; i < (startIndex + number); i++) {
        this._renderFilm(filmsData[i], container.querySelector(`.films-list__container`), i);
        this._checkRenderCards = this._checkRenderCards + 1;
      }
    }
  }

  _renderExtraCards(container, extraFilms) {
    if (this._filmsData.length === 0) {
      return;
    } else {
      for (let i = 0; i < extraFilms.length; i++) {
        this._renderFilm(extraFilms[i], container.querySelector(`.films-list__container`));
      }
    }
  }

  _renderShowMore(Data) {

    const showMoreCards = () => {
      const currentNumberCards = this._checkRenderCards;
      let storedCard = Data.length - currentNumberCards;
      if (storedCard === 0) {
        this._showMore.getElement().style.display = `none`;
      } else if (storedCard < this._NUMBER_MORE_RENDER_CARDS) {
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, Data, this.filmsList);
        this._showMore.getElement().style.display = `none`;
      } else {
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, Data, this.filmsList);
      }
    };

    this._sort.getElement()
    .addEventListener(`click`, () => {
      this._showMore.getElement().removeEventListener(`click`, showMoreCards);
    });

    // this._menu.getElement()
    // .addEventListener(`click`, () => {
      // this._showMore.getElement(this._currentFilmsList).removeEventListener(`click`, showMoreCards);
    // });

    this._showMore.getElement().addEventListener(`click`, showMoreCards);
    render(this.filmsList, this._showMore.getElement(), position.BEFOREEND);
  }

  _onDataChange(newData, oldData) {
    const currentFilmCard = this._filmsData.find((element) => element.id === oldData.id);
    console.log(oldData);
    console.log(newData);
    currentFilmCard.watchlist = newData.watchlist;
    currentFilmCard.watched = newData.watched;
    currentFilmCard.favorite = newData.favorite;
    currentFilmCard.userRating = newData.userRating;
    if (newData.comment === null) {
      currentFilmCard.comments.forEach((item) => {
        if (item.id === newData.commentId) {
          // console.log(item.id);
          // console.log(item.indexOf);
          currentFilmCard.splice(item.indexOf);
        }
      });
    } else {
      currentFilmCard.comments.push(newData.comment);
      currentFilmCard.comments.forEach((element, index) => {
        element.id = index;
      });
    }
    this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((item) => {
      unrender(item);
    });
    this._checkRenderCards = 0;
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
    this._renderExtraCards(this.filmsListRate, this._topRated(this._filmsData, `rating`));
    this._renderExtraCards(this.filmsListComments, this._mostCommented(this._filmsData, `comments`));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  _generateWatchlist() {
    this._filmsData.forEach((item) => {
      if (item.watchlist) {
        this._filmsWatchlist.push(item);
      }
    });
  }

  _generateWatched() {
    this._filmsData.forEach((item) => {
      if (item.watched) {
        this._filmsHistory.push(item);
      }
    });
  }

  _generateFavorites() {
    this._filmsData.forEach((item) => {
      if (item.favorite) {
        this._filmsFavorites.push(item);
      }
    });
  }

  _changeFilmlist() {
    const menuPoints = this._menu.getElement().querySelectorAll(`.main-navigation__item`);
    menuPoints.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (item.id === `stats`) {
          return;
        }
        this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((element) => {
          unrender(element);
        });
        if (item.id === `all`) {
          this._currentFilmsList = this._filmsData;
          this._checkRenderCards = 0;
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
          this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
          this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
          unrender(this._showMore.getElement(this._currentFilmsList));
          // this._showMore.getElement().removeEventListener(`click`);
          this._renderShowMore(this._filmsData);
        } else if (item.id === `watchlist`) {
          this._generateWatchlist();
          this._currentFilmsList = this._filmsWatchlist;
          this._checkRenderCards = 0;
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsWatchlist, this.filmsList);
          this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
          this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
          unrender(this._showMore.getElement(this._currentFilmsList));
          this._showMore.getElement().remove();
          this._renderShowMore(this._filmsWatchlist);
        } else if (item.id === `history`) {
          this._generateWatched();
          this._currentFilmsList = this._filmsHistory;
          this._checkRenderCards = 0;
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsHistory, this.filmsList);
          this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
          this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
          unrender(this._showMore.getElement(this._currentFilmsList));
          this._renderShowMore(this._filmsHistory);
        } else if (item.id === `favorites`) {
          this._generateFavorites();
          this._currentFilmsList = this._filmsFavorites;
          this._checkRenderCards = 0;
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsFavorites, this.filmsList);
          this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
          this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
          unrender(this._showMore.getElement(this._currentFilmsList));
          this._renderShowMore(this._filmsFavorites);
        }
      });
    });
  }

  _mostCommented(arr, by) {
    if (!SortHandlers[by]) {
      return ``;
    }
    let sorted = SortHandlers[by](arr.slice(0));
    if (by === `comments`) {
      return sorted.slice(0, 2);
    }
  }

  _topRated(arr, by) {
    let sorted = SortHandlers[by](arr.slice(0));
    if (!SortHandlers[by] || sorted[0].rating === 0) {
      return ``;
    } else if (by === `rating`) {
      return sorted.slice(0, 2);
    }
  }

  _switchStatistic() {
    this._menu.getElement().querySelector(`#stats`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const hidden = this._statistic.getElement().classList.contains(`visually-hidden`);
      if (hidden) {
        this._statistic.getElement().classList.remove(`visually-hidden`);
      } else {
        this._statistic.getElement().classList.add(`visually-hidden`);
      }
    });
  }
}

export {PageController};
