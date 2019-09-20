import {Search} from '../components/search.js';
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

const SortHandlers = {
  'date': (arr) => arr.sort((a, b) => b.year - a.year),
  'rating': (arr) => arr.sort((a, b) => b.rating - a.rating),
  'default': (arr) => arr.sort((a, b) => a - b)
};

class PageController {

  constructor(containerHeader, containerMain, containerFooter, ratingData, menuData, footerData, filmsData, extraFilmsData) {
    this._containerMain = containerMain;
    this._containerHeader = containerHeader;
    this._containerFooter = containerFooter;
    this._search = new Search();
    this._rating = new Rating(ratingData);
    this._menu = new Menu(menuData);
    this._sort = new Sort();
    this._filmsWrapper = new FilmsWrapper();
    this._footerClass = new Footer(footerData);
    this._filmsData = filmsData;
    this._extraFilmsData = extraFilmsData;
    this._noFilms = new NoFilms();
    this._showMore = new ShowMore();
    this._checkRenderCards = 0;
    this._NUMBER_MORE_RENDER_CARDS = 5;
    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {

    // Отрисовка блоков поиска, рейтинга пользователя, меню, обертки для фильмов и подвала
    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    render(this._containerHeader, this._rating.getElement(), position.BEFOREEND);
    render(this._containerMain, this._menu.getElement(), position.BEFOREEND);
    render(this._containerMain, this._sort.getElement(), position.BEFOREEND);
    render(this._containerMain, this._filmsWrapper.getElement(), position.BEFOREEND);
    render(this._containerFooter, this._footerClass.getElement(), position.BEFOREEND);

    // Поиск элементов в ДОМ-API
    this.filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    this.filmsListRate = this._filmsWrapper.getElement().querySelector(`.films-list--rate`);
    this.filmsListComments = this._filmsWrapper.getElement().querySelector(`.films-list--comments`);

    // Отрисовка карточек фильмов и кнопки show more
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
    this._renderExtraCards(this.filmsListRate);
    this._renderExtraCards(this.filmsListComments);
    this._renderShowMore(this._filmsData);
    // renderShowMore(this._filmMocks);

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
    // renderShowMore(sorted);
    return sorted;
  }

  _renderFilm(filmData, container, index) {
    const film = new Film(filmData);
    const popupRenderElements = [];
    const filmControls = [];
    const subscriptions = this._subscriptions;
    const onDataChange = this._onDataChange;
    const onChangeView = this._onChangeView;


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
        const formData = new FormData(film.getElement().querySelector(`.film-card__controls`));
        const entry = {
          _watchlist: Boolean(formData.get(`_watchlist`)),
          _watched: Boolean(formData.get(`_watched`)),
          _favorites: Boolean(formData.get(`_favorites`)),
        };
        const value = evt.target.name;
        switch (value) {
          case `value`:
            entry[value] = !entry[value];
            break;
          // case `watchlist`:
          //  entry._watchlist = !entry._watchlist;
          //  break;
          // case `watched`:
          //  entry._watched = !entry._watched;
          //  break;
          // case `favorites`:
          //  entry._favorites = !entry._favorites;
          //  break;
        }

        if (item.classList.contains(`film-card__controls-item--active`)) {
          item.classList.remove(`film-card__controls-item--active`);
        } else {
          item.classList.add(`film-card__controls-item--active`);
        }
        // console.log(item.classList.contains(`film-card__controls-item--active`));
        // console.log(film._favorites);
        console.log(entry);
        console.log(entry[value]);
        // console.log(entry._favorites);
        // console.log(entry._watchlist);
        this._onDataChange(entry, film);

        // this._onDataChange(entry, film);
      });
    });

    film.getElement().id = index;
    render(container, film.getElement(), position.BEFOREEND);
    this._subscriptions = subscriptions;
    // console.log(subscriptions);
    // console.log(this._subscriptions);
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

  _renderExtraCards(container) {
    if (this._filmsData.length === 0) {
      return;
    } else {
      const extraFilmsData = this._extraFilmsData;
      for (let i = 0; i < extraFilmsData.length; i++) {
        this._renderFilm(extraFilmsData[i], container.querySelector(`.films-list__container`));
      }
    }
  }

  _renderShowMore(filmsData) {

    const showMoreCards = () => {
      const currentNumberCards = this._checkRenderCards;
      let storedCard = filmsData.length - currentNumberCards;
      if (storedCard === 0) {
        this._showMore.getElement().style.display = `none`;
      } else if (storedCard < this._NUMBER_MORE_RENDER_CARDS) {
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, filmsData, this.filmsList);
        this._showMore.getElement().style.display = `none`;
      } else {
        this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, filmsData, this.filmsList);
      }
    };

    this._sort.getElement()
    .addEventListener(`click`, () => {
      this._showMore.getElement().removeEventListener(`click`, showMoreCards);
    });

    this._showMore.getElement().addEventListener(`click`, showMoreCards);
    render(this.filmsList, this._showMore.getElement(), position.BEFOREEND);
  }

  _onDataChange(newData, oldData) {
    const currentFilmCard = this._filmsData.find(oldData);
    console.log(currentFilmCard);
    currentFilmCard._watchlist = newData._watchlist;
    currentFilmCard._watched = newData._watched;
    currentFilmCard._favorites = newData._favorites;
    // currentFilmCard.editableKey = newData.editableKey;
    this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((item) => {
      unrender(item);
    });

    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmsData, this.filmsList);
    this._renderExtraCards(this.filmsListRate);
    this._renderExtraCards(this.filmsListComments);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}

export {PageController};
