import Joi from 'joi';

export const v = {};

v.update = {
  body: Joi.object()
    .keys({
      read: Joi.boolean().required(),
    })
    .unknown(false),
};
