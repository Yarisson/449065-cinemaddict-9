import {getUser} from './data.js';
import {films} from './data.js';
import {PageController} from './controllers/page-controller.js';
import {API} from './api.js';

const filmsData = films;

// моковые данные для рандер функций
// const filmsData = films;
// const WatchlistData = filmsWatchlist;
// const HistoryData = filmsWatched;
// const FavoritesData = filmsFavorites;
const ratingData = getUser();
// const footerData = getFilmsAll();

console.log(filmsData);
// console.log(filmsData[1].comments.length);

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict/`;

// const taskListElement = document.querySelector(`.board__tasks`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

// const onDataChange = () => {};

// const pageController = new PageController(taskListElement, onDataChange);

const pageController = new PageController(header, main, footer, ratingData, filmsData);

api.getFilms().then((movies) => pageController.init(movies));

// Добавляем экземпляр класс pageController и запускаем в нем метод init
// const pageController = new PageController(header, main, footer, ratingData, footerData, filmsData, WatchlistData, HistoryData, FavoritesData);
// pageController.init();
