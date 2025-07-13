import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import {
  CreateTicketDto,
  getRegistrationDataList,
  LeaveParkingDTO,
} from './dto/ticket.dto';
import { TicketJwtAuthGuard } from '../common/guard/ticket-jwt.guard';
import { Public } from '../common/decorator/public.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Public()
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }

  @Public()
  @UseGuards(TicketJwtAuthGuard)
  @Put('leave-parking')
  leaveParking(@Body() leaveParkingDto: LeaveParkingDTO) {
    return this.ticketService.leaveParking(leaveParkingDto);
  }

  @Get('registration-plate-number/list')
  getRegistrationPlateNumberList(@Query() query: getRegistrationDataList) {
    return this.ticketService.getRegistrationPlateNumberList(query);
  }

  @Get('registration-allocated-slot-number/list')
  getRegistrationAllocatedSlotNumberList(
    @Query() query: getRegistrationDataList,
  ) {
    return this.ticketService.getRegistrationAllocatedSlotNumberList(query);
  }
}
