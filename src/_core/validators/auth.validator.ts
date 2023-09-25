import Joi from 'joi';

export const validateLogin = (body: any) => {
  const { error } = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(body);

  return error;
};

export const validateRegister = (body: any) => {
  const { error } = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(body);

  return error;
};
