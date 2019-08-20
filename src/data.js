const date = new Date();
let filmYear = ( date.getFullYear() - Math.round(Math.random()*100 ));

const TEXT_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Cras aliquet varius magna, non porta ligula feugiat eget.
  Fusce tristique felis at fermentum pharetra.
  Aliquam id orci ut lectus varius viverra.
  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
  Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
  Sed sed nisi sed augue convallis suscipit in sed felis.
  Aliquam erat volutpat.
  Nunc fermentum tortor ac porta dapibus.
  In rutrum ac purus sit amet tempus.`
];

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
  ],
  poster: {
    url: `../public/images/posters/made-for-each-other.png`,
    url: `../public/images/posters/popeye-meets-sinbad.png`,
    url: `../public/images/posters/sagebrush-trail.jpg`,
    url: `../public/images/posters/santa-claus-conquers-the-martians.jpg`,
    url: `../public/images/posters/the-dance-of-life.jpg`,
    url: `../public/images/posters/the-great-flamarion.jpg`,
    url: `../public/images/posters/popeye-meets-sinbad.jpg`,
  },
  description: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Eat soFusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ][Math.floor(Math.random() * 3)],
  rating: ((Math.random() * (10 - 0)) + 0).toFixed(1),
  year: filmYear,
  numberComments: Math.round(Math.random() * 100),
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
});

export {getCard};