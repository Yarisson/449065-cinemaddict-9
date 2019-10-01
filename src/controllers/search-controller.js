import {Search} from '../components/search.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class SearchController {
  constructor(containerHeader, data, renderFilm) {
    this._containerHeader = containerHeader;
    this._search = new Search();
    this._data = data;
    this._renderFilm = renderFilm;
  }

  init() {
    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    const searchInput = this._search.getElement().querySelector(`.search__field`);
    const searchButton = this._search.getElement().querySelector(`.search__active`);
    const searchButtonReset = this._search.getElement().querySelector(`.search__reset`);
    searchButton.addEventListener(`click`, (evt) => this._onSearchButtonClick(evt));
    searchButtonReset.addEventListener(`click`, (evt) => this._onSearchButtonReset(evt, searchInput, searchButton));
    searchInput.addEventListener(`change`, (evt) => this._onInputChange(evt, searchInput, searchButton));

    // this._searchFilm();
  }

  // _searchFilm() {

    // const onSearchButtonClick = (evt, button) => {
      // evt.preventDefault();
      // button.classList.add(`visually-hidden`);
      // const filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
      // const searchFilm = [];
      // const searchText = searchInput.value;
      // this._data.forEach((element) => {
        // if (element.title.toLowerCase() === searchText.toLowerCase()) {
          // searchFilm.push(element);
        // }
      // });
      // console.log(this._filmsWrapper.getElement().querySelectorAll(`.film-card`));
      // console.log(filmsList);
      // this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((element) => {
        // console.log(element);
        // unrender(element);
      // });
      // this._checkRenderCards = 0;

      // if (searchFilm.length === 0) {
        // render(filmsList, this._noFilms.getElement(), position.BEFOREEND);
      // } else {
        // for (let i = 0; i < searchFilm.length; i++) {
          // this._renderFilm(searchFilm[i], filmsList, i);
          // this._checkRenderCards = this._checkRenderCards + 1;
        // }
      // }
      //
      // this._showMore.getElement().classList.add(`visually-hidden`);

      // console.log(searchFilm);
      // console.log(searchFilm.length);
      // console.log(searchText);
    // };


  // }

  _onInputChange(evt, input, button) {
    evt.preventDefault();
    if (input.value.length < 3) {
      input.value = ``;
    } else {
      button.classList.remove(`visually-hidden`);
    }
  }

  _onSearchButtonReset(evt, input, button) {
    evt.preventDefault();
    input.value = ``;
    button.classList.add(`visually-hidden`);
  }

  _onSearchButtonClick(evt) {
    const searchInput = this._search.getElement().querySelector(`.search__field`);
    const searchButton = this._search.getElement().querySelector(`.search__active`);
    evt.preventDefault();
    searchButton.classList.add(`visually-hidden`);
    const filmsList = this._filmsWrapper.getElement().querySelector(`.films-list`);
    const searchFilm = [];
    const searchText = searchInput.value;
    this._data.forEach((element) => {
      if (element.title.toLowerCase() === searchText.toLowerCase()) {
        searchFilm.push(element);
      }
    });
    console.log(this._filmsWrapper.getElement().querySelectorAll(`.film-card`));
    console.log(filmsList);
    this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((element) => {
      console.log(element);
      unrender(element);
    });
    this._checkRenderCards = 0;

    if (searchFilm.length === 0) {
      render(filmsList, this._noFilms.getElement(), position.BEFOREEND);
    } else {
      for (let i = 0; i < searchFilm.length; i++) {
        this._renderFilm(searchFilm[i], filmsList, i);
        this._checkRenderCards = this._checkRenderCards + 1;
      }
    }
    //
    // this._showMore.getElement().classList.add(`visually-hidden`);

    console.log(searchFilm);
    console.log(searchFilm.length);
    console.log(searchText);
  }

}

export {SearchController};
