import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  global: process.env.JWT_GLOBAL === 'true',
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
}));
