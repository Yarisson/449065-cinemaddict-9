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

class PageController {
  constructor(containerHeader, containerMain, containerFooter, ratingMock, menuMock, footerMock, filmMocks, extraFilmMocks) {
    this._containerMain = containerMain;
    this._containerHeader = containerHeader;
    this._containerFooter = containerFooter;
    this._search = new Search();
    this._rating = new Rating(ratingMock);
    this._menu = new Menu(menuMock);
    this._sort = new Sort();
    this._filmsWrapper = new FilmsWrapper();
    this._footerClass = new Footer(footerMock);
    this._filmMocks = filmMocks;
    this._extraFilmMocks = extraFilmMocks;
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
    const filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    const filmsListRate = this._filmsWrapper.getElement().querySelector(`.films-list--rate`);
    const filmsListComments = this._filmsWrapper.getElement().querySelector(`.films-list--comments`);

    const SortHandlers = {
      'date': (arr) => arr.sort((a, b) => b.year - a.year),
      'rating': (arr) => arr.sort((a, b) => b.rating - a.rating),
      'default': (arr) => arr.sort((a, b) => a - b)
    };

    /**
      * Функция для рендера кнопки show more
    */

    const renderShowMore = (mocks) => {

      const showMoreCards = () => {
        const currentNumberCards = this._checkRenderCards;
        let storedCard = mocks.length - currentNumberCards;
        if (storedCard === 0) {
          this._showMore.getElement().style.display = `none`;
        } else if (storedCard < this._NUMBER_MORE_RENDER_CARDS) {
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, mocks, filmsList);
          this._showMore.getElement().style.display = `none`;
        } else {
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, mocks, filmsList);
        }
      };

      this._sort.getElement()
      .addEventListener(`click`, () => {
        this._showMore.getElement().removeEventListener(`click`, showMoreCards);
      });

      this._showMore.getElement().addEventListener(`click`, showMoreCards);
      render(filmsList, this._showMore.getElement(), position.BEFOREEND);
    };

    // Отрисовка карточек фильмов и кнопки show more
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmMocks, filmsList);
    this._renderExtraCards(filmsListRate);
    this._renderExtraCards(filmsListComments);
    renderShowMore(this._filmMocks);

    let sortArr = (arr, by) => {
      if (!SortHandlers[by]) {
        throw new Error(`Unknown sort key: ${by}`);
      }

      let sorted = SortHandlers[by](arr.slice(0));
      this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, sorted, filmsList);
      unrender(this._showMore.getElement(this._filmMocks));
      renderShowMore(sorted);
      return sorted;
    };

    this._sort.getElement()
    .addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      filmsList.querySelector(`.films-list__container`).innerHTML = ``;
      this._checkRenderCards = 0;
      this._sort.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      if (evt.target.dataset.sortType === `date`) {
        sortArr(this._filmMocks, `date`);
      } else if (evt.target.dataset.sortType === `rating`) {
        sortArr(this._filmMocks, `rating`);
      } else {
        sortArr(this._filmMocks, `default`);
      }
    });

  }

  _renderFilm(filmMock, container, index) {
    const film = new Film(filmMock);
    const popupRenderElements = [];
    const subscriptions = this._subscriptions;
    const onDataChange = this._onDataChange;
    const onChangeView = this._onChangeView;


    popupRenderElements.push(film.getElement().querySelector(`.film-card__poster`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__title`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__comments`));

    popupRenderElements.forEach(function (item) {
      item.addEventListener(`click`, () => {
        const movieController = new MovieController(container, filmMock, onDataChange, onChangeView);
        movieController.init();
        subscriptions.push(movieController.setDefaultView.bind(movieController));
      });
    });

    film.getElement().id = index;
    render(container, film.getElement(), position.BEFOREEND);

    this._subscriptions = subscriptions;
    console.log(subscriptions);
    console.log(this._subscriptions);
  }

  _renderFilmCards(number, mocks, container) {
    const startIndex = this._checkRenderCards;
    if (mocks.length === 0) {
      render(container.querySelector(`.films-list__container`), this._noFilms.getElement(), position.BEFOREEND);
    } else {
      for (let i = startIndex; i < (startIndex + number); i++) {
        this._renderFilm(mocks[i], container.querySelector(`.films-list__container`), i);
        this._checkRenderCards = this._checkRenderCards + 1;
      }
    }
  }

  _renderFilmExtraCards(mocks, container) {
    if (mocks.length === 0) {
      return;
    } else {
      for (let i = 0; i < mocks.length; i++) {
        this._renderFilm(mocks[i], container);
      }
    }
  }

  _renderExtraCards(container) {
    if (this._filmMocks.length === 0) {
      return;
    } else {
      const extraMocks = this._extraFilmMocks;
      for (let i = 0; i < extraMocks.length; i++) {
        this._renderFilm(extraMocks[i], container.querySelector(`.films-list__container`));
      }
    }
  }

  _onDataChange(newData, oldData) {
    const currentIndexOfFilmCard = this._filmMocks.findIndex((it) => it === oldData);
    const keysOfNewData = Object.keys(newData);

    keysOfNewData.forEach((key) => { // Ищем нужные свойства объекта карточка филма и меняем их
      this._filmMocks[currentIndexOfFilmCard][key] = newData[key];
    });

    unrender(this._filmsWrapper.getElement(this._filmMocks));
    render(this._containerMain, this._filmsWrapper.getElement(), position.BEFOREEND);
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmMocks, this.filmsList);
    this._renderExtraCards(this.filmsListRate);
    this._renderExtraCards(this.filmsListComments);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

}

export {PageController};
