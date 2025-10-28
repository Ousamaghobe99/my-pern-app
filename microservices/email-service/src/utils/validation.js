import Joi from 'joi';

const emailSchema = Joi.object({
  to: Joi.string().email().required(),
  from: Joi.string().email(),
  subject: Joi.string().required(),
  templateName: Joi.string(),
  templateData: Joi.object(),
  html: Joi.string(),
  text: Joi.string(),
  metadata: Joi.object()
}).or('templateName', 'html', 'text');

export function validateEmail(data) {
  return emailSchema.validate(data);
}