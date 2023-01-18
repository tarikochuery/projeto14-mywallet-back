import Joi from 'joi';

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
  passwordConfirmation: Joi.any().valid(Joi.ref('password')).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email({ tlds: { allow: false } }),
  password: Joi.string().required()
});

export const transactionSchema = Joi.object({
  value: Joi.number().min(0).required(),
  description: Joi.string().required(),
  type: Joi.valid('income', 'outcome').required()
});