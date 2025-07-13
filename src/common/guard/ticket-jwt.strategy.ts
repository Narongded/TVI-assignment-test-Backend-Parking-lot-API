import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ITicketConfig } from '../interface/common.interface';
import { ITicketBody } from '../../ticket/interface/ticket.interface';

@Injectable()
export class TicketJwtStrategy extends PassportStrategy(
  Strategy,
  'ticket-jwt',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<ITicketConfig>('ticket').ticketSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: ITicketBody) {
    const body: ITicketBody = request.body as unknown as ITicketBody;
    const invalidTicketId = body?.id !== payload.id;
    const invalidPlateNumber = body?.plateNumber !== payload.plateNumber;
    const invalidSlotNumber = body?.slotNumber !== payload.slotNumber;

    if (invalidTicketId || invalidPlateNumber || invalidSlotNumber) {
      throw new ForbiddenException('Invalid ticket details');
    }

    return payload;
  }
}
