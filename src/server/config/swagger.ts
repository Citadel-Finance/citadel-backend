import config from './config';

export default {
  pathPrefixSize: 2,
  basePath: '/api/',
  host: process.env.LOCAL == 'TRUE' ? 'localhost:3000' : 'citadelfinance.io',
  grouping: 'tags',
  info: {
    title: 'API Documentation',
    version: '',
    description: 'API Documentation\n\n',
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      'x-keyPrefix': 'Bearer ',
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
  jsonPath: '/documentation.json',
  documentationPath: '/documentation',
  debug: true,
};
