import {
  Controller,
  Post,
  Body,
  UseGuards,
  ParseIntPipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/parking-lot.dto';
import { JwtAuthGuard } from '../common/guard/jwt.guard';
import { Public } from '../common/decorator/common.decorator';

@UseGuards(JwtAuthGuard)
@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.createParkingLot(createParkingLotDto);
  }

  @Get('status/:id')
  @Public()
  getStatus(@Param('id', ParseIntPipe) id: number) {
    return this.parkingLotService.getStatus(id);
  }
}
