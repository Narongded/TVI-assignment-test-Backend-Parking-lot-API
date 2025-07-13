import { registerAs } from '@nestjs/config';

export default registerAs('ticket', () => ({
  ticketSecret: process.env.TICKET_SECRET || 'ticket_secret',
}));
