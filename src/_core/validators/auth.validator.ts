import Joi from "joi";

export const validateLogin = (body: any) => {
    const { error } = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).validate(body);

    return error;
}