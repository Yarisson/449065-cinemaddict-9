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
    this._onDataChange = this._onDataChange.bind(this);
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
    const filmsListsExtra = this._filmsWrapper.getElement().querySelectorAll(`.films-list--extra`);

    const SortHandlers = {
      'date': (arr) => arr.sort((a, b) => b.year - a.year),
      'rating': (arr) => arr.sort((a, b) => b.rating - a.rating),
      'default': (arr) => arr.sort((a, b) => a - b)
    };

    /**
      * Функция рендера карточки фильма
    */

    // const renderFilm = (filmMock, container, index) => {
    //  const film = new Film(filmMock);
    //  const popupRenderElements = [];

    //  popupRenderElements.push(film.getElement().querySelector(`.film-card__poster`));
    //  popupRenderElements.push(film.getElement().querySelector(`.film-card__title`));
    //  popupRenderElements.push(film.getElement().querySelector(`.film-card__comments`));

    //  popupRenderElements.forEach(function (item) {
    //    item.addEventListener(`click`, () => {
    //      const movieController = new MovieController(container, filmMock);
    //      movieController.init();
    //    });
    //  });

    //  film.getElement().id = index;
    //  render(container, film.getElement(), position.BEFOREEND);
    // };

    /**
      * Функция рендера нескольких карточек
    */

    // const renderFilmCards = (number, mocks) => {
    //  const startIndex = this._checkRenderCards;
    //  if (mocks.length === 0) {
    //    render(filmsList.querySelector(`.films-list__container`), this._noFilms.getElement(), position.BEFOREEND);
    //  } else {
    //    for (let i = startIndex; i < (startIndex + number); i++) {
    //      renderFilm(mocks[i], filmsList.querySelector(`.films-list__container`), i);
    //      this._checkRenderCards = this._checkRenderCards + 1;
    //    }
    //  }
    // };

    /**
      * Функция рендера extra карточек
    */

    // const renderExtraCards = () => {
    //  if (this._filmMocks.length === 0) {
    //    return;
    //  } else {
    //    const extraMocks = this._extraFilmMocks;
    //    filmsListsExtra.forEach(function (item) {
    //      for (let i = 0; i < extraMocks.length; i++) {
    //        renderFilm(extraMocks[i], item.querySelector(`.films-list__container`));
    //      }
    //    });
    //  }
    // };

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
          // renderFilmCards(storedCard, mocks);
          this._showMore.getElement().style.display = `none`;
        } else {
          this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, mocks, filmsList);
          // renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, mocks);
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
    // renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmMocks);
    const extraFilmMocks = this._extraFilmMocks;
    const renderFilmExtraCards = this._renderFilmExtraCards;
    filmsListsExtra.forEach(function (element) {
      renderFilmExtraCards(extraFilmMocks, element.querySelector(`.films-list__container`));
    });
    // this._renderFilmExtraCards(this._extraFilmMocks, filmsListsExtra.querySelector(`.films-list__container`));
    // renderExtraCards();
    renderShowMore(this._filmMocks);

    let sortArr = (arr, by) => {
      if (!SortHandlers[by]) {
        throw new Error(`Unknown sort key: ${by}`);
      }

      let sorted = SortHandlers[by](arr.slice(0));
      this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, sorted, filmsList);
      // renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, sorted);
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

    popupRenderElements.push(film.getElement().querySelector(`.film-card__poster`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__title`));
    popupRenderElements.push(film.getElement().querySelector(`.film-card__comments`));

    popupRenderElements.forEach(function (item) {
      item.addEventListener(`click`, () => {
        const movieController = new MovieController(container, filmMock);
        movieController.init();
      });
    });

    film.getElement().id = index;
    render(container, film.getElement(), position.BEFOREEND);
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

  // _renderExtraCards() {
  //  if (this._filmMocks.length === 0) {
  //    return;
  //  } else {
  //    const extraMocks = this._extraFilmMocks;
  //    this.filmsListsExtra.forEach(function (item) {
  //      for (let i = 0; i < extraMocks.length; i++) {
  //        this._renderFilm(extraMocks[i], item.querySelector(`.films-list__container`));
  //      }
  //    });
  //  }
  // }

  _onDataChange(newData, oldData) {
    const currentIndexOfFilmCard = this._filmMocks.findIndex((it) => it === oldData);
    const keysOfNewData = Object.keys(newData);

    keysOfNewData.forEach((key) => { // Ищем нужные свойства объекта карточка филма и меняем их
      this._filmMocks[currentIndexOfFilmCard][key] = newData[key];
    });

    unrender(this._filmsWrapper.getElement(this._filmMocks));
    this._renderFilmCards(this._NUMBER_MORE_RENDER_CARDS, this._filmMocks, this.filmsList);
    // unrender(this._filmListContainerAll.getElement());
    // this._filmListContainerAll.removeElement();
    // unrender(filmsList.querySelector(`.films-list__container`));
    // filmsList.querySelector(`.films-list__container`)
    // unrender(this._filmMocks.getElement());
    // this._filmMocks.removeElement();
    // render(this._filmsWrapper.getElement().querySelector(`.films-list__container`), this._filmMocks.getElement(), position.BEFOREEND);
  }

}

export {PageController};
