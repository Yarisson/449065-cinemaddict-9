import {getFilmsAll} from './data.js';
import {getUser} from './data.js';
import {films} from './data.js';
import {getMenu} from './data.js';
import {extraFilms} from './data.js';
import {PageController} from './controllers/page-controller.js';

// моковые данные для рандер функций
const filmMocks = films;
const extraFilmMocks = extraFilms;
const menuMocks = getMenu();
const ratingMocks = getUser();
const footerMocks = getFilmsAll();

// Поиск элементов в ДОМ-API
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

// Добавляем экземпляр класс pageController и запускаем в нем метод init
const pageController = new PageController(header, main, footer, ratingMocks, menuMocks, footerMocks, filmMocks, extraFilmMocks);
pageController.init();
