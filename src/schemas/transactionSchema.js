import Joi from "joi";

export const transactionSchema = Joi.object({
  value: Joi.number().min(0).required(),
  description: Joi.string().required(),
  type: Joi.valid('income', 'outcome').required()
});