import moment from 'moment';

const NOVICE = 11;
const FAN = 21;
const NUMBER_OF_FILMS = 42;

const TEXT_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const generateUserRating = () => {
  let numberFilms = Math.round(Math.random() * 100);
  if (numberFilms === 0) {
    return ``;
  } else if (numberFilms < NOVICE) {
    return `novice`;
  } else if (numberFilms < FAN) {
    return `fan`;
  } else {
    return `movie buff`;
  }
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getFilmYear = () => {
  return moment(getRandomDate(new Date(1919, 0, 0), new Date())).format(`DD MMMM YYYY`);
};

const getCommentDate = () => {
  return moment(getRandomDate(new Date(2019, 8, 1), new Date())).fromNow();
};

const getRandomDescription = (arr) => {
  let numberElements = arr.length;
  let text = ``;
  for (let i = 0; i < (Math.floor(Math.random() * 2) + 1); i++) {
    text = `${text} ${arr[Math.floor(Math.random() * numberElements)]}`;
  }
  return text;
};

const getUser = () => ({
  status: generateUserRating(),
});

const getCommentaries = () => ({
  emoji: [
    `/images/emoji/angry.png`,
    `/images/emoji/puke.png`,
    `/images/emoji/sleeping.png`,
    `/images/emoji/smile.png`,
    `/images/emoji/trophy.png`,
  ][Math.floor(Math.random() * 5)],
  text: [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
    `Fantastic!`,
    `Amazing cast!`,
    `This is bad`,
  ][Math.floor(Math.random() * 7)],
  author: [
    `Tim Macoveev`,
    `John Doe`,
    `Duncan McLeod`,
    `Richie Ryan`,
    `Joe Dawson`,
    `Jacob Call`,
    `Connor McLeod`,
  ][Math.floor(Math.random() * 7)],
  day: getCommentDate(),
});

const getCard = () => ({
  title: [
    `Back to the future`,
    `Star wars`,
    `Flash gordon`,
    `Total recall`,
    `Star gate`,
    `Doctor who`,
    `Rocky`,
    `Major league`,
    `6 day, 7 night`,
    `Enemy of the state`,
    `The Lives of others`,
    `Gone in sixty seconds`,
    `The rock`,
    `Lost`,
    `Professional`
  ][[Math.floor(Math.random() * 15)]],
  poster: [
    `/images/posters/made-for-each-other.png`,
    `/images/posters/popeye-meets-sinbad.png`,
    `/images/posters/sagebrush-trail.jpg`,
    `/images/posters/santa-claus-conquers-the-martians.jpg`,
    `/images/posters/the-dance-of-life.jpg`,
    `/images/posters/the-great-flamarion.jpg`,
    `/images/posters/the-man-with-the-golden-arm.jpg`,
  ][Math.floor(Math.random() * 7)],
  description: [
    getRandomDescription(TEXT_DESCRIPTION)
  ],
  rating: ((Math.random() * (10 - 0)) + 0).toFixed(1),
  date: getFilmYear(),
  hours: Math.round(Math.random() * 1) + 1,
  minutes: Math.round(Math.random() * 60),
  genre: [
    `Comedy`,
    `Mystery`,
    `Drama`,
    `Fiction`,
    `Horror`,
    `Crime & Gangster`,
    `Adventure`,
  ][Math.floor(Math.random() * 7)],
  favorite: Boolean(Math.round(Math.random() * 1)),
  watchlist: Boolean(Math.round(Math.random() * 1)),
  watched: Boolean(Math.round(Math.random() * 1)),
  userRating: ``,
  id: ``,
});

const films = [];
const filmsWatchlist = [];
const filmsWatched = [];
const filmsFavorites = [];

const generateFilms = () => {
  for (let i = 0; i < NUMBER_OF_FILMS; i++) {
    films.push(getCard());
    films[i].id = i;
  }
};

const generateFilmComments = () => {
  films.forEach((film) => {
    film.comments = [];
    for (let i = 0; i < (Math.floor(Math.random() * 100)); i++) {
      film.comments.push(getCommentaries());
    }
  });
};

const generateFilmYear = () => {
  films.forEach((film) => {
    film.year = moment(film.date).format(`YYYY`);
  });
};

const generateWatchlist = () => {
  films.forEach((item) => {
    if (item.watchlist) {
      filmsWatchlist.push(item);
    }
  });
};

const generateWatched = () => {
  films.forEach((item) => {
    if (item.watched) {
      filmsWatched.push(item);
    }
  });
};

const generateFavorites = () => {
  films.forEach((item) => {
    if (item.favorite) {
      filmsFavorites.push(item);
    }
  });
};

generateFilms();
generateWatchlist();
generateWatched();
generateFavorites();
generateFilmComments();
generateFilmYear();

const getFilmsNumber = () => {
  return films.length;
};

const getFilmsAll = () => ({
  allFilms: getFilmsNumber(),
});

export {getUser};
export {getCommentaries};
export {getCard};
export {films};
export {filmsWatchlist};
export {filmsWatched};
export {filmsFavorites};
export {getFilmsAll};
