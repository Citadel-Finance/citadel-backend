import * as Joi from 'joi';

export const outputOkSchema = (res: Joi.Schema): Joi.Schema => Joi.object({
  ok: Joi.boolean().example(true),
  result: res,
});

export function outputPaginationSchema(title: string, item: Joi.Schema): Joi.Schema {
  return Joi.object({
    ok: Joi.boolean().example(true),
    result: Joi.object({
      count: Joi.number().integer().example(10),
      [title]: Joi.array().items(item),
    }),
  });
}

export const outputArraySchema = (res: Joi.Schema): Joi.Schema => Joi.object({
  ok: Joi.string().example(true),
  result: Joi.array().example(
    '"data": [[{"totalDeposited": "101092000000000000000","createdAt": "2020-06-09T11:42:10.774Z"},]]'
  ),
});
