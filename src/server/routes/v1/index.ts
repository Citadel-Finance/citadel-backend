import * as Joi from 'joi';
import { getTransactionGraph, graphEnum, intervalEnum } from '../../api/v1/graph';
import { getfactory } from '../../api/v1/factory';
import { outputArraySchema } from '../../schemes';

export default [
  {
    method: 'GET',
    path: '/v1/graph/{pool}/{graph}/{interval}',
    handler: getTransactionGraph,
    options: {
      id: 'v1.user.getTransactionGraph',
      auth: false,
      description: `This method gives a data for graphs.`,
      tags: ['api', 'v1', 'user', 'graph'],
      validate: {
        params: Joi.object({
          pool: Joi.string().min(42).max(42).required(),
          graph: Joi.valid(...Object.values(graphEnum)),
          interval: Joi.valid(...Object.values(intervalEnum)),
        }),
        failAction: (req, h, err) =>
          err.isJoi ? h.response(err.details[0]).takeover().code(400) : h.response(err).takeover(),
      },
      response: {
        schema: outputArraySchema(
          Joi.object({
            Array: Joi.array().example(''),
          })
        ),
      },
    },
  },{
    method: 'GET',
    path: '/v1/getfactory',
    handler: getfactory,
    options: {
      id: 'v1.getfactory',
      auth: false,
      description: 'This method returns an actual factory address.',
      tags: ['api', 'v1', 'factory']
    },
  },
  
];
