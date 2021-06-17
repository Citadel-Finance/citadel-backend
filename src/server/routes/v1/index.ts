import * as Joi from 'joi';
import { getTransactionGraph, graphEnum, intervalEnum } from '../../api/v1/graph';
import { outputArraySchema } from '../../schemes';

export default [
  {
    method: 'GET',
    path: '/v1/graph/{graph}/{interval}',
    handler: getTransactionGraph,
    options: {
      id: 'v1.user.getTransactionGraph',
      auth: false,
      description: `This method gives a data for graphs.`,
      tags: ['api', 'v1', 'user', 'graph'],
      validate: {
        params: Joi.object({
          graph: Joi.string().min(12).max(15).required(),
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
  },
];
