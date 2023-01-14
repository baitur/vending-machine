import * as dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  port: Number(process.env['APP_PORT']),
};

export const authConfig = {
  providers: {
    jwt: {
      secret: process.env['JWT_SECRET'],
      expiresIn: '72h',
    },
  },
};

export const hashingConfig = {
  bcrypt: {
    defaultRounds: 10,
  },
};
