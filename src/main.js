import {getFilmsAll} from './data.js';
import {getUser} from './data.js';
import {films} from './data.js';
import {PageController} from './controllers/page-controller.js';
import {filmsWatchlist} from './data.js';
import {filmsWatched} from './data.js';
import {filmsFavorites} from './data.js';

// моковые данные для рандер функций
const filmsData = films;
const WatchlistData = filmsWatchlist;
const HistoryData = filmsWatched;
const FavoritesData = filmsFavorites;
const ratingData = getUser();
const footerData = getFilmsAll();

// console.log(filmsData[1].comments.length);

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

// Добавляем экземпляр класс pageController и запускаем в нем метод init
const pageController = new PageController(header, main, footer, ratingData, footerData, filmsData, WatchlistData, HistoryData, FavoritesData);
pageController.init();
