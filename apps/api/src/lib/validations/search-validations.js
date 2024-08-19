import Joi from 'joi';

export const v = {};

v.index = {
  query: Joi.object().keys({
    q: Joi.string().min(3).optional(),
    aggregate: Joi.boolean().optional(),
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

v.search = {
  body: Joi.object()
    .keys({
      query: Joi.object(),
      aggregate: Joi.object(),
      options: Joi.object()
        .keys({
          select: Joi.object(),
          page: Joi.number(),
          limit: Joi.number(),
        })
        .default({
          page: 1,
          limit: process.env.PER_PAGE ? parseInt(process.env.PER_PAGE) : 25,
        }),
    })
    .xor('aggregate', 'query'),
};

v.surveyResponse = {
  body: Joi.object().keys({
    survey: Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.number().required(),
  }),
};
