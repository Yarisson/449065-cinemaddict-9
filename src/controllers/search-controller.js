import {Search} from '../components/search.js';
import {FilmsWrapper} from '../components/films.js';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class SearchController {
  constructor(containerHeader, data) {
    this._containerHeader = containerHeader;
    this._filmsWrapper = new FilmsWrapper();
    this._search = new Search();
    this._data = data;
  }

  init() {
    render(this._containerHeader, this._search.getElement(), position.BEFOREEND);
    this._searchFilm();
  }

  _searchFilm() {
    const searchInput = this._search.getElement().querySelector(`.search__field`);
    const searchButton = this._search.getElement().querySelector(`.search__active`);
    const searchButtonReset = this._search.getElement().querySelector(`.search__reset`);

    const onInputChange = (evt) => {
      evt.preventDefault();
      if (searchInput.value.length < 3) {
        searchInput.value = ``;
      } else {
        searchButton.classList.remove(`visually-hidden`);
      }
    };

    const onSearchButtonReset = (evt) => {
      evt.preventDefault();
      searchInput.value = ``;
      searchButton.classList.add(`visually-hidden`);
    };

    const onSearchButtonClick = (evt) => {
      evt.preventDefault();
      searchButton.classList.add(`visually-hidden`);
      const searchFilm = [];
      const searchText = searchInput.value;
      this._filmsData.forEach((element) => {
        if (element.title.toLowerCase() === searchText.toLowerCase()) {
          searchFilm.push(element);
        }
      });
      this._filmsWrapper.getElement().querySelectorAll(`.film-card`).forEach((element) => {
        unrender(element);
        this._checkRenderCards = 0;
        this._renderFilmCards(searchFilm.length, searchFilm, this.filmsList);
        // this._showMore.getElement().classList.add(`visually-hidden`);
      });

      console.log(searchFilm);
      console.log(searchFilm.length);
      console.log(searchText);
    };

    searchButton.addEventListener(`click`, onSearchButtonClick);
    searchButtonReset.addEventListener(`click`, onSearchButtonReset);
    searchInput.addEventListener(`change`, onInputChange);
  }

}

export {SearchController};
