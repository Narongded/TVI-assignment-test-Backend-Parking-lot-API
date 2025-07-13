import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TicketJwtAuthGuard extends AuthGuard('ticket-jwt') {}
