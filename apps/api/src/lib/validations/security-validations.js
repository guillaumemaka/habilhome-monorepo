import Joi from 'joi';

export const v = {};

v.ResetPassword = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).max(15).required(),
    passwordConfirm: Joi.ref('password'),
  }).with('password', 'passwordConfirm'),
};

v.EmailVerificationToken = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

v.ForgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email(),
  }),
};
