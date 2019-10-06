import Chart from '../../node_modules/chart.js';
import {Statistic} from '../components/statistic';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

const SortHandlers = {
  'statistic': (arr) => arr.sort((a, b) => b.numberFilms - a.numberFilms)
};

class StatisticController {
  constructor(containerMain, filmsHistory, rating, filmsData) {
    this._containerMain = containerMain;
    this._filmsHistory = filmsHistory;
    this._rating = rating;
    this._statisticData = [];
    this._filmsData = filmsData;
  }

  init() {
    this._getStatistic();
    this._sortGenres();
    this._statistic = new Statistic(this._statisticData);
    render(this._containerMain, this._statistic.getElement(), position.BEFOREEND);
    this._drawStatistic();
  }

  update(updateFilmsHistory, mainContainer) {
    unrender(this._statistic.getElement());
    this._filmsHistory = updateFilmsHistory;
    this._getStatistic();
    this._sortGenres();
    this._statistic = new Statistic(this._statisticData);
    this._containerMain = mainContainer;
    render(this._containerMain, this._statistic.getElement(), position.AFTERBEGIN);
    this._drawStatistic();
  }

  _getStatistic() {
    const watchedFilms = this._filmsHistory.length;
    let allWatchedTimeHours = 0;
    let allWatchedTimeMinutes = 0;
    const genres = [];
    this._filmsHistory.forEach((element) => {
      allWatchedTimeHours = allWatchedTimeHours + element.hours;
      allWatchedTimeMinutes = allWatchedTimeMinutes + element.minutes;
      genres.push(element.genre);
    });

    allWatchedTimeHours = allWatchedTimeHours + (parseInt(allWatchedTimeMinutes / 60, 10));
    allWatchedTimeMinutes = allWatchedTimeMinutes % 60;
    this._allWatchedTimeHours = allWatchedTimeHours;
    this._allWatchedTimeMinutes = allWatchedTimeMinutes;
    this._genres = genres;
    this._watchedFilms = watchedFilms;
    this._statisticData.hours = this._allWatchedTimeHours;
    this._statisticData.minutes = this._allWatchedTimeMinutes;
    this._statisticData.genres = this._genres;
    this._statisticData.numberWatchedFilms = this._watchedFilms;
    this._statisticData.status = this._rating;
  }

  _sortGenres() {
    const numberFilms = [];
    let numberComedy = 0;
    let numberMystery = 0;
    let numberDrama = 0;
    let numberFiction = 0;
    let numberHorror = 0;
    let numberCrime = 0;
    let numberAdventure = 0;

    this._statisticData.genres.forEach((element) => {
      if (element === `Comedy`) {
        numberComedy = numberComedy + 1;
      } else if (element === `Mystery`) {
        numberMystery = numberMystery + 1;
      } else if (element === `Drama`) {
        numberDrama = numberDrama + 1;
      } else if (element === `Fiction`) {
        numberFiction = numberFiction + 1;
      } else if (element === `Horror`) {
        numberHorror = numberHorror + 1;
      } else if (element === `Crime & Gangster`) {
        numberCrime = numberCrime + 1;
      } else if (element === `Adventure`) {
        numberAdventure = numberAdventure + 1;
      }
    });

    const chartFilms = [];
    numberFilms.comedy = numberComedy;
    numberFilms.mystery = numberMystery;
    numberFilms.drama = numberDrama;
    numberFilms.fiction = numberFiction;
    numberFilms.horror = numberHorror;
    numberFilms.crime = numberCrime;
    numberFilms.adventure = numberAdventure;
    let topGenre = `comedy`;
    let number = numberFilms.comedy;
    Object.entries(numberFilms);
    for (let [key, value] of Object.entries(numberFilms)) {
      if (value > number) {
        number = value;
        topGenre = key;
      }
      const genre = {
        genre: key,
        numberFilms: value
      };
      chartFilms.push(genre);
    }

    this._statisticData.films = chartFilms;
    this._statisticData.topGenre = topGenre;
    this._sortStatistic(this._statisticData.films, `statistic`);
    this._statisticData.films = this._sortStatistic(this._statisticData.films, `statistic`);
  }

  _sortStatistic(arr, by) {
    let sorted = SortHandlers[by](arr.slice(0));
    if (by === `statistic`) {
      return sorted;
    }
    return ``;
  }

  _drawStatistic() {

    let dataFilms = [];
    let dataGenres = [];
    this._statisticData.films.forEach((element) => {
      dataFilms.push(element.numberFilms);
      dataGenres.push(`${element.genre} ${element.numberFilms}`);
    });

    let ctx = this._statistic.getElement().querySelector(`.statistic__chart`).getContext(`2d`);
    let myChart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        labels: dataGenres,
        datasets: [{
          data: dataFilms,
          backgroundColor: [
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`
          ],
          borderColor: [
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`,
            `#FBE44D`
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }],
          yAxes: [{
            ticks: {
              fontSize: 26,
              beginAtZero: true,
              family: `Open Sans`,
              fontStyle: 400,
              fontColor: `white`,
            }
          }]
        }
      },
      title: {
        display: false,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      tooltips: {
        mode: false,
      },
      legend: {
        position: `left`,
        labels: {
          display: false,

        }
      }
    });

    myChart.defaults = `Open Sans`;
  }

  switchStatistic(mainContainer) {
    mainContainer.querySelector(`#stats`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const hidden = this._statistic.getElement().classList.contains(`visually-hidden`);
      if (hidden) {
        this._statistic.getElement().classList.remove(`visually-hidden`);
      } else {
        this._statistic.getElement().classList.add(`visually-hidden`);
      }
    });
  }

}

export {StatisticController};
