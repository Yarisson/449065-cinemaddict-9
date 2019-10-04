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
    this._sortedStatistic();
  }

  _drawStatistic() {

    let ctx = this._statistic.getElement().querySelector(`.statistic__chart`).getContext(`2d`);
    let myChart = new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        labels: [`comedy ${this._statisticData.numberFilms.comedy}`,
          `mystery ${this._statisticData.numberFilms.mystery}`,
          `drama ${this._statisticData.numberFilms.drama}`,
          `fiction ${this._statisticData.numberFilms.fiction}`,
          `horror ${this._statisticData.numberFilms.horror}`,
          `crime ${this._statisticData.numberFilms.crime}`,
          `adventure ${this._statisticData.numberFilms.adventure}`],
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
        title: {
          display: true,
          fontSize: 46,
          fontColor: `white`
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
      legend: {
        position: `left`,
        labels: {
          fontSize: 26,
          family: `Open Sans`,
          fontStyle: 400,
          fontColor: `white`,
          boxWidth: 45,
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

  _sort2() {
    for (key in this._statisticData.numberFilms) {
      const sortedArrayOfObj = this._statisticData.numberFilms.sort((a, b) => {
        return b.key > a.key;
      });
    }
  }

  _sortedStatistic() {

    let arrayLabel = [`comedy ${this._statisticData.numberFilms.comedy}`,
      `mystery ${this._statisticData.numberFilms.mystery}`,
      `drama ${this._statisticData.numberFilms.drama}`,
      `fiction ${this._statisticData.numberFilms.fiction}`,
      `horror ${this._statisticData.numberFilms.horror}`,
      `crime ${this._statisticData.numberFilms.crime}`,
      `adventure ${this._statisticData.numberFilms.adventure}`];

    let arrayData = [this._statisticData.numberFilms.comedy,
      this._statisticData.numberFilms.mystery,
      this._statisticData.numberFilms.drama,
      this._statisticData.numberFilms.fiction,
      this._statisticData.numberFilms.horror,
      this._statisticData.numberFilms.crime,
      this._statisticData.numberFilms.adventure];

    const arrayOfObj = arrayLabel.map((d, i) => {
      return {
        label: d,
        data: arrayData[i] || 0
      };
    });

    const sortedArrayOfObj = arrayOfObj.sort((a, b) => {
      return b.data > a.data;
    });

    let newArrayLabel = [];
    let newArrayData = [];
    sortedArrayOfObj.forEach((d) => {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });

    console.log(newArrayLabel);
    console.log(newArrayData);
  }

}

export {StatisticController};
