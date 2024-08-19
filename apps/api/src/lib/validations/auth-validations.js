import Joi from 'joi';

export const v = {};

v.Signin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

v.Signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    active: Joi.boolean().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
    passwordConfirm: Joi.string().min(8).max(15).required(),
    roles: Joi.array().default(['user']),
  }),
};

v.UserUpdate = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    active: Joi.boolean(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(15),
    roles: Joi.array(),
  }),
};
