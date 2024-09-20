import * as joi from 'joi';
import * as dotenv from 'dotenv';

dotenv.config();

interface IEnv {
  PORT: string;

  NATS_SERVERS: string[];

  STRIPE_SECRET_KEY: string;
  STRIPE_SESSION_SUCCESS_URL: string;
  STRIPE_SESSION_CANCEL_URL: string;
  STRIPE_WEBHOOK_SECRET_KEY: string;
}

const envSchema = joi
  .object({
    PORT: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),

    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SESSION_SUCCESS_URL: joi.string().required(),
    STRIPE_SESSION_CANCEL_URL: joi.string().required(),
    STRIPE_WEBHOOK_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Error validating environment variables: ${error.message}`);
}

const envVars: IEnv = value;

export const envs: IEnv = {
  PORT: envVars.PORT,
  NATS_SERVERS: envVars.NATS_SERVERS,

  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  STRIPE_SESSION_SUCCESS_URL: envVars.STRIPE_SESSION_SUCCESS_URL,
  STRIPE_SESSION_CANCEL_URL: envVars.STRIPE_SESSION_CANCEL_URL,
  STRIPE_WEBHOOK_SECRET_KEY: envVars.STRIPE_WEBHOOK_SECRET_KEY,
};
