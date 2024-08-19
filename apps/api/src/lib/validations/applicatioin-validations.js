import Joi from 'joi';

export const v = {};

v.index = {
  query: Joi.object().keys({
    q: Joi.string().min(3).optional(),
    page: Joi.number().default(1).optional(),
    limit: Joi.number()
      .default(process.env.PER_PAGE ? parseInt(process.env.PER_PAGE) : 25)
      .optional(),
    sort: Joi.string().default('name:1').optional(),
  }),
};

v.get = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
