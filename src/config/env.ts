import * as joi from 'joi';
import * as dotenv from 'dotenv';

dotenv.config();

interface IEnv {
  PORT: string;

  STRIPE_SECRET_KEY: string;
  STRIPE_SESSION_SUCCESS_URL: string;
  STRIPE_SESSION_CANCEL_URL: string;
  STRIPE_WEBHOOK_SECRET_KEY: string;
}

const envSchema = joi
  .object({
    PORT: joi.string().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SESSION_SUCCESS_URL: joi.string().required(),
    STRIPE_SESSION_CANCEL_URL: joi.string().required(),
    STRIPE_WEBHOOK_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Error validating environment variables: ${error.message}`);
}

export const envs: IEnv = {
  PORT: process.env.PORT,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_SESSION_SUCCESS_URL: process.env.STRIPE_SESSION_SUCCESS_URL,
  STRIPE_SESSION_CANCEL_URL: process.env.STRIPE_SESSION_CANCEL_URL,
  STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,
};
