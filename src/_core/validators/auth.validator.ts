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
    password: Joi.string().required()
    .required()
    .min(6)
    .max(255)
    .pattern(
      new RegExp(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
    .messages({ 'string.pattern.base':  'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.' }),
  }).validate(body);

  return error;
};
