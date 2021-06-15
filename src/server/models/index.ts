import { Sequelize, } from 'sequelize-typescript';
import config from '../config/config';
import { Graph, } from './Graph';

export const initDatabase = async () => {
  try {
    const sequelize = new Sequelize(config.dbLink, {
      dialect: 'postgres',
      models: [Graph],
      logging: false,
    });

    console.log('Connection has been established successfully.');

    await sequelize.sync();
    await sequelize.authenticate();
    return sequelize;
  }
  catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default initDatabase;
