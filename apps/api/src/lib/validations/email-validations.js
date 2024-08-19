import Joi from 'joi';

export const v = {};

v.post = {
  body: Joi.object().keys({
    from: Joi.string().required(),
    message: Joi.string().required(),
    fullName: Joi.string().required(),
  }),
};
