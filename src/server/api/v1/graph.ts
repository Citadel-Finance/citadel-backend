import { Sequelize, Op } from 'sequelize';
import { error, output } from '../../utils';
import { Graph } from '../../models/Graph';
import { BigNumber } from 'bignumber.js';

export enum graphEnum {
  deposited,
  borrowed,
  profit,
}

export enum intervalEnum {
  day,
  week,
  all,
}

export const getTransactionGraph = async (r) => {
  try {
    const poolAddress: string = r.params.pool;
    const graphType: string = r.params.graph;
    const startInterval: string = r.params.interval;
    const timestampNow = new Date().valueOf();

    console.log(poolAddress, ' ', graphType, ' ', startInterval);

    let intervalsAmount: number;
    let timeBetweenIntervals: number;

    switch (startInterval.toUpperCase()) {
      case 'DAY':
        intervalsAmount = 24;
        timeBetweenIntervals = 3600 * 1000;
        break;

      case 'WEEK':
        intervalsAmount = 7;
        timeBetweenIntervals = 3600 * 24 * 1000;
        break;

      case 'ALL':
        intervalsAmount = 20;
        timeBetweenIntervals = 3600 * 24 * 31 * 1000;
        break;

      default:
        // WEEK
        intervalsAmount = 7;
        timeBetweenIntervals = 3600 * 24 * 1000;
        break;
    }

    let getData: any = [];
    let dataArray = [];

    for (let interval = 1; interval <= intervalsAmount; interval++) {
      let mean = new BigNumber(0);
      getData = await Graph.findAll({
        attributes: [[Sequelize.literal(`ROUND(AVG("${graphType}"), 0)`), 'value']],
        where: {
          createdAt: {
            [Op.between]: [
              timestampNow - timeBetweenIntervals * interval,
              timestampNow - timeBetweenIntervals * (interval - 1),
            ],
          },
          pool: poolAddress,
        },
        raw: true,
      });

      for (let record of getData) {
        if (record.value) {
          mean = mean.plus(new BigNumber(record.value));
        }
      }

      let dataForPeriod = {
        value: mean.toString(),
        createdAt: new Date(timestampNow - timeBetweenIntervals * interval),
      };
      dataArray.push(dataForPeriod);
    }

    return output({ data: dataArray.reverse() });
  } catch (err) {
    console.log(err);
    return error(500000, 'Failed to get transactions graph', null);
  }
};
