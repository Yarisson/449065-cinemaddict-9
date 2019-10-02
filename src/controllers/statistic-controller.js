import Chart from '../../node_modules/chart.js';
import {Statistic} from '../components/statistic';
import {position} from '../utils.js';
import {render} from '../utils.js';

class StatisticController {
  constructor(containerMain, statisticData) {
    this._containerMain = containerMain;
    this._statisticData = statisticData;
    this._statistic = new Statistic(statisticData);
  }

  init() {
    render(this._containerMain, this._statistic.getElement(), position.BEFOREEND);
    this._switchStatistic();
    this._drawStatistic();
  }

  _drawStatistic() {
    let ctx = this._statistic.getElement().querySelector(`.statistic__chart`).getContext(`2d`);
    let myChart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        labels: [`comedy`, `mystery`, `drama`, `fiction`, `horror`, `crime`, `adventure`],
        datasets: [{
          label: `films genres`,
          data: [this._statisticData.numberFilms.comedy,
            this._statisticData.numberFilms.mystery,
            this._statisticData.numberFilms.drama,
            this._statisticData.numberFilms.fiction,
            this._statisticData.numberFilms.horror,
            this._statisticData.numberFilms.crime,
            this._statisticData.numberFilms.adventure
          ],
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
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  _switchStatistic() {
    this._containerMain.querySelector(`#stats`).addEventListener(`click`, (evt) => {
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
