const { env } = process;

// initializing env variables
require('dotenv').config();

const configs = {
    PORT: env.APP_PORT,
    DB_HOST: env.DB_HOST,
    DB_USER: env.DB_USER,
    DB_PORT: env.DB_PORT,
    DB_PASSWORD: env.DB_PASSWORD,
    DATABASE: env.DATABASE,
    NODE_ENV: env.NODE_ENV,
    JWT_KEY: env.JWT_KEY,
    SMS_EMAIL: env.SMS_EMAIL,
    SMS_PASSWORD: env.SMS_PASSWORD,
    CODE_ATTEMPTS: env.CODE_ATTEMPTS || 5,
};

module.exports = configs;
