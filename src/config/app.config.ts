import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 3000,
  name: process.env.APP_NAME || 'Parking Lot',
  version: process.env.APP_VERSION || '1.0.0',
}));
