import {Statistic} from '../components/statistic';
import {position} from '../utils.js';
import {render} from '../utils.js';
import {unrender} from '../utils.js';

class StatisticController {
  constructor(containerMain, statisticData) {
    this._containerMain = containerMain;
    this._statistic = new Statistic(statisticData);
  }

  init() {
    render(this._containerMain, this._statistic.getElement(), position.BEFOREEND);
  }

}

export {StatisticController};
