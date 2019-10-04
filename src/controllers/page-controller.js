import {Sort} from '../components/sort.js';
import {Menu} from '../components/menu.js';
import {Footer} from '../components/footer.js';
import {Rating} from '../components/rating.js';
import {FilmsWrapper} from '../components/films.js';
import {Film} from '../components/film.js';
import {NoFilms} from '../components/no-films.js';
import {ShowMore} from '../components/show-more.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';
import {MovieController} from './movie-controller.js';
import {SearchController} from './search-controller.js';
import {StatisticController} from './statistic-controller';

const SortHandlers = {
  'date': (arr) => arr.sort((a, b) => b.year - a.year),
  'rating': (arr) => arr.sort((a, b) => b.rating - a.rating),
  'default': (arr) => arr.sort((a, b) => a - b),
  'comments': (arr) => arr.sort((a, b) => b.comments.length - a.comments.length),
  'statistic': (arr) => arr.sort((a, b) => b - a)
};

class PageController {

  constructor(containerHeader, containerMain, containerFooter, ratingData, statisticData, footerData, filmsData, WatchlistData, HistoryData, FavoritesData) {
    this._containerMain = containerMain;
    this._containerHeader = containerHeader;
    this._containerFooter = containerFooter;
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
    this._checkRenderCards = 0;
    this._NUMBER_MORE_RENDER_CARDS = 5;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
    this._currentFilmsList = this._filmsData;
    this._allWatchedTimeHours = 0;
    this._allWatchedTimeMinutes = 0;
    this._genres = [];
    this._watchedFilms = this._filmsHistory.length;
    this._statisticData = {};
    this._ratingData = ratingData;
  }

  init() {
    const renderFilm = this._renderFilm;
    const filmsWrapper = this._filmsWrapper;
    const showMore = this._showMore;
    const noFilms = this._noFilms;
    render(this._containerMain, this._menu.getElement(), position.BEFOREEND);

    this._getStatistic();
    this._sortGenres();
    let statisticController = new StatisticController(this._containerMain, this._statisticData);
    statisticController.init();
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
    this._renderShowMore(this._currentFilmsList);
    let searchController = new SearchController(this._containerHeader, this._filmsData, renderFilm, filmsWrapper, showMore, noFilms);
    searchController.init();
    render(this._containerHeader, this._rating.getElement(), position.BEFOREEND);

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

    this._menu.getElement().querySelectorAll(`.main-navigation__item`).forEach((item) => {
      item.addEventListener(`click`, (evt) => this._changeFilmlist(evt));
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
        const currentElement = evt.target;
        const currentProperty = evt.target.name;
        const currentId = evt.target.closest(`.film-card`).id;

        if (currentProperty === `watchlist`) {
          this._filmsData[Number(currentId)].watchlist = !this._filmsData[Number(currentId)].watchlist;
        } else if (currentProperty === `watched`) {
          this._filmsData[Number(currentId)].watched = !this._filmsData[Number(currentId)].watched;
        } else if (currentProperty === `favorite`) {
          this._filmsData[Number(currentId)].favorite = !this._filmsData[Number(currentId)].favorite;
        }

        if (currentElement.classList.contains(`film-card__controls-item--active`)) {
          currentElement.classList.remove(`film-card__controls-item--active`);
        } else {
          currentElement.classList.add(`film-card__controls-item--active`);
        }
      });

      // this._generateFavorites();
      // this._generateWatched();
      // this._generateWatchlist();
      // unrender(this._menu.getElement());
      // render(this._containerMain, this._menu.getElement(), position.AFTERBEGIN);
    });

    render(container, film.getElement(), position.BEFOREEND);
    this._subscriptions = subscriptions;
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
    this._showMore.getElement().style.display = `block`;

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

    this._menu.getElement().querySelectorAll(`.main-navigation__item`).forEach((element) => {
      element.addEventListener(`click`, () => {
        this._showMore.getElement(this._currentFilmsList).removeEventListener(`click`, showMoreCards);
      });
    });


    this._showMore.getElement().addEventListener(`click`, showMoreCards);
    render(this.filmsList, this._showMore.getElement(), position.BEFOREEND);
  }

  _onDataChange(newData, oldData) {
    console.log(oldData);
    console.log(newData);
    const currentFilmCard = this._filmsData.find((element) => element.id === oldData.id);
    currentFilmCard.watchlist = newData.watchlist;
    currentFilmCard.watched = newData.watched;
    currentFilmCard.favorite = newData.favorite;
    currentFilmCard.userRating = newData.userRating;
    if (newData.comment === null) {
      currentFilmCard.comments.forEach((item) => {
        if (item.id === newData.commentId) {
          currentFilmCard.splice(item.indexOf);
        }
      });
    } else if (newData.comment === ``) {
      return;
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
    this._filmsWatchlist = [];
    this._filmsData.forEach((item) => {
      if (item.watchlist) {
        this._filmsWatchlist.push(item);
      }
    });
  }

  _generateWatched() {
    this._filmsHistory = [];
    this._filmsData.forEach((item) => {
      if (item.watched) {
        this._filmsHistory.push(item);
      }
    });
  }

  _generateFavorites() {
    this._filmsFavorites = [];
    this._filmsData.forEach((item) => {
      if (item.favorite) {
        this._filmsFavorites.push(item);
      }
    });
  }

  _changeFilmlist(evt) {
    evt.preventDefault();
    unrender(this._noFilms.getElement());
    if (evt.target.id === `stats`) {
      return;
    } else {
      this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((element) => {
        unrender(element);
      });
      unrender(this._showMore.getElement(this._currentFilmsList));
      if (evt.target.id === `all`) {

        this._currentFilmsList = this._filmsData;
        this._checkRenderCards = 0;
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
        this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
        this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
        this._renderShowMore(this._filmsData);
      } else if (evt.target.id === `watchlist`) {
        this._generateWatchlist();
        this._currentFilmsList = this._filmsWatchlist;
        this._checkRenderCards = 0;
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsWatchlist, this.filmsList);
        this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
        this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
        this._renderShowMore(this._filmsWatchlist);
      } else if (evt.target.id === `history`) {
        this._generateWatched();
        this._currentFilmsList = this._filmsHistory;
        this._checkRenderCards = 0;
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsHistory, this.filmsList);
        this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
        this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
        this._renderShowMore(this._filmsHistory);
      } else if (evt.target.id === `favorites`) {
        this._generateFavorites();
        this._currentFilmsList = this._filmsFavorites;
        this._checkRenderCards = 0;
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsFavorites, this.filmsList);
        this._renderExtraCards(this.filmsListRate, this._topRated(this._currentFilmsList, `rating`));
        this._renderExtraCards(this.filmsListComments, this._mostCommented(this._currentFilmsList, `comments`));
        this._renderShowMore(this._filmsFavorites);
      }
    }
  }

  _mostCommented(arr, by) {
    if (!SortHandlers[by]) {
      return ``;
    }
    let sorted = SortHandlers[by](arr.slice(0));
    if (by === `comments`) {
      return sorted.slice(0, 2);
    }

    return ``;
  }

  _topRated(arr, by) {
    let sorted = SortHandlers[by](arr.slice(0));
    if (!SortHandlers[by] || sorted[0].rating === 0) {
      return ``;
    } else if (by === `rating`) {
      return sorted.slice(0, 2);
    }

    return ``;
  }

  _getStatistic() {
    const watchedFilms = this._filmsHistory.length;
    let allWatchedTimeHours = 0;
    let allWatchedTimeMinutes = 0;
    const genres = [];
    this._filmsHistory.forEach((element) => {
      allWatchedTimeHours = allWatchedTimeHours + element.hours;
      allWatchedTimeMinutes = allWatchedTimeMinutes + element.minutes;
      genres.push(element.genre);
    });

    allWatchedTimeHours = allWatchedTimeHours + (parseInt(allWatchedTimeMinutes / 60, 10));
    allWatchedTimeMinutes = allWatchedTimeMinutes % 60;
    this._allWatchedTimeHours = allWatchedTimeHours;
    this._allWatchedTimeMinutes = allWatchedTimeMinutes;
    this._genres = genres;
    this._watchedFilms = watchedFilms;
    this._statisticData.hours = this._allWatchedTimeHours;
    this._statisticData.minutes = this._allWatchedTimeMinutes;
    this._statisticData.genres = this._genres;
    this._statisticData.numberWatchedFilms = this._watchedFilms;
    this._statisticData.status = this._ratingData.status;
  }

  _sortGenres() {
    const numberFilms = [];
    let numberComedy = 0;
    let numberMystery = 0;
    let numberDrama = 0;
    let numberFiction = 0;
    let numberHorror = 0;
    let numberCrime = 0;
    let numberAdventure = 0;

    this._statisticData.genres.forEach((element) => {
      if (element === `Comedy`) {
        numberComedy = numberComedy + 1;
      } else if (element === `Mystery`) {
        numberMystery = numberMystery + 1;
      } else if (element === `Drama`) {
        numberDrama = numberDrama + 1;
      } else if (element === `Fiction`) {
        numberFiction = numberFiction + 1;
      } else if (element === `Horror`) {
        numberHorror = numberHorror + 1;
      } else if (element === `Crime & Gangster`) {
        numberCrime = numberCrime + 1;
      } else if (element === `Adventure`) {
        numberAdventure = numberAdventure + 1;
      }
    });

    numberFilms.comedy = numberComedy;
    numberFilms.mystery = numberMystery;
    numberFilms.drama = numberDrama;
    numberFilms.fiction = numberFiction;
    numberFilms.horror = numberHorror;
    numberFilms.crime = numberCrime;
    numberFilms.adventure = numberAdventure;
    let topGenre = `comedy`;
    let number = numberFilms.comedy;
    Object.entries(numberFilms);
    for (let [key, value] of Object.entries(numberFilms)) {
      if (value > number) {
        number = value;
        topGenre = key;
      }
    }
    this._statisticData.numberFilms = numberFilms;
    this._statisticData.topGenre = topGenre;
    // for (let [key, value] of Object.entries(this._statisticData.numberFilms)) {
    this._sortGenresTop(Object.entries(this._statisticData.numberFilms), `statistic`);
    // }
    // this._sortGenresTop(this._statisticData, `statistic`);
    console.log(this._sortGenresTop(Object.entries(this._statisticData.numberFilms), `statistic`));
  }

  _sortGenresTop(arr, by) {
    if (!SortHandlers[by]) {
      return ``;
    }
    let sorted = SortHandlers[by](arr);
    if (by === `statistic`) {
      return sorted;
    }

    return ``;
  }

}
export {PageController};
