import { Op } from 'sequelize';
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
    let timeBetweenIntervals;

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
        timeBetweenIntervals = 3600 * 60 * 24 * 31 * 1000;
        break;

      default:
        // WEEK
        intervalsAmount = 7;
        timeBetweenIntervals = 3600 * 24 * 1000;
        break;
    }

    let getData: any = [];
    const dataArray = [];

    for (let i = 1; i <= intervalsAmount; i++) {
      const dataObject: any = {};
      const boundraryTimestamp = timestampNow - (i - 1) * timeBetweenIntervals;
      dataObject.timestamp = timestampNow - i * timeBetweenIntervals;
      getData = await Graph.findAll({
        attributes: [graphType, 'createdAt'],
        where: {
          [Op.and]: [
            { createdAt: { [Op.gte]: new Date(dataObject.timestamp) } },
            { createdAt: { [Op.lte]: new Date(boundraryTimestamp) } },
          ],
        },
        // logging: true,
      });

      if (getData.length !== 0) {
        dataArray.push(getData);
      }
    }
    console.log(JSON.stringify({ data: dataArray.reverse() }));
    return output({ data: dataArray.reverse() });
  } catch (err) {
    console.log(err);
    return error(500000, 'Failed to get transactions graph', null);
  }
};
