import { Sequelize, Op } from 'sequelize';
import { error, output } from '../../utils';
import { Graph } from '../../models/Graph';

export const graphEnum = {
  DEPOS: 'totalDeposited',
  BORR: 'totalBorrowed',
  PROF: 'totalProfit',
};

export const getTransactionGraph = async (r) => {
  try {
    const graphType: string = r.params.graph;
    const startInterval: string = r.params.interval;
    const timestampNow = new Date().valueOf();

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
    const msPerInterval = Math.floor((timestampNow - timeBetweenIntervals) / intervalsAmount);

    for (let interval = 1; interval <= intervalsAmount; interval++) {
      getData = await Graph.findAll({
        attributes: [
          [
            Sequelize.literal(
              `round(extract(epoch from "createdAt" - '${new Date(
                timeBetweenIntervals
              ).toISOString()}'::date)/${(msPerInterval / 1000).toFixed(0)})`
            ),
            'points',
          ],
          [Sequelize.literal(`avg("${graphType}")`), 'value'],
        ],
        where: {
          createdAt: {
            [Op.between]: [
              timestampNow - timeBetweenIntervals * interval,
              timestampNow - timeBetweenIntervals * (interval - 1),
            ],
          },
        },
        group: ['points'],
        // logging: true,
      });

      if (getData.length !== 0) {
        getData.push({ createdAt: new Date(timestampNow - timeBetweenIntervals * interval) });
        dataArray.push(...getData);
      }
    }

    return output({ data: dataArray.reverse() });
  } catch (err) {
    console.log(err);
    return error(500000, 'Failed to get transactions graph', null);
  }
};
