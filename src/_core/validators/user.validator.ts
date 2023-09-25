import Joi from 'joi';

export const validateCreateProfile = (body: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthdate: Joi.date().required(),
    address: Joi.object({
      present: Joi.string().required(),
      permanent: Joi.string().optional().allow(null),
    }).required(),
    contact: Joi.object({
      email: Joi.string().email().required(),
      number: Joi.string().required(),
    }).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
  });

  const { error } = schema.validate(body);
  return error;
};
