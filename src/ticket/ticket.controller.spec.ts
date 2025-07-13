import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import {
  CreateTicketDto,
  LeaveParkingDTO,
  getRegistrationDataList,
} from './dto/ticket.dto';
import { ECarSize } from '../car/enums/car.enum';

describe('TicketController', () => {
  let controller: TicketController;
  let mockTicketService: Partial<jest.Mocked<TicketService>>;

  beforeEach(async () => {
    mockTicketService = {
      createTicket: jest.fn(),
      leaveParking: jest.fn(),
      getRegistrationPlateNumberList: jest.fn(),
      getRegistrationAllocatedSlotNumberList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        plateNumber: 'ABC-1234',
        size: ECarSize.SMALL,
        parkingLotId: 1,
      };

      const mockResult = {
        ticketData: {
          id: 1,
          plateNumber: 'ABC-1234',
          size: ECarSize.SMALL,
          slotNumber: 'A01',
        },
        ticketToken: 'mock-jwt-token',
      };

      mockTicketService.createTicket.mockResolvedValue(mockResult);

      const result = await controller.create(createTicketDto);

      expect(mockTicketService.createTicket).toHaveBeenCalledWith(
        createTicketDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const createTicketDto: CreateTicketDto = {
        plateNumber: 'ABC-1234',
        size: ECarSize.SMALL,
        parkingLotId: 1,
      };

      const error = new Error('Service error');
      mockTicketService.createTicket.mockRejectedValue(error);

      await expect(controller.create(createTicketDto)).rejects.toThrow(error);

      expect(mockTicketService.createTicket).toHaveBeenCalledWith(
        createTicketDto,
      );
    });
  });

  describe('leaveParking', () => {
    it('should process leaving parking', async () => {
      const leaveParkingDto: LeaveParkingDTO = {
        id: 1,
        plateNumber: 'ABC-1234',
        size: ECarSize.SMALL,
        slotNumber: 'A01',
      };

      const mockResult = 'Car has left the parking successfully';

      mockTicketService.leaveParking.mockResolvedValue(mockResult);

      const result = await controller.leaveParking(leaveParkingDto);

      expect(mockTicketService.leaveParking).toHaveBeenCalledWith(
        leaveParkingDto,
      );
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const leaveParkingDto: LeaveParkingDTO = {
        id: 1,
        plateNumber: 'ABC-1234',
        size: ECarSize.SMALL,
        slotNumber: 'A01',
      };

      const error = new Error('Service error');
      mockTicketService.leaveParking.mockRejectedValue(error);

      await expect(controller.leaveParking(leaveParkingDto)).rejects.toThrow(
        error,
      );

      expect(mockTicketService.leaveParking).toHaveBeenCalledWith(
        leaveParkingDto,
      );
    });
  });

  describe('getRegistrationPlateNumberList', () => {
    it('should get registration plate number list', async () => {
      const query: getRegistrationDataList = {
        parkingLotId: 1,
        carSize: ECarSize.SMALL,
      };

      const mockResult = ['ABC-1234', 'XYZ-5678'];

      mockTicketService.getRegistrationPlateNumberList.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getRegistrationPlateNumberList(query);

      expect(
        mockTicketService.getRegistrationPlateNumberList,
      ).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const query: getRegistrationDataList = {
        parkingLotId: 1,
        carSize: ECarSize.SMALL,
      };

      const error = new Error('Service error');
      mockTicketService.getRegistrationPlateNumberList.mockRejectedValue(error);

      await expect(
        controller.getRegistrationPlateNumberList(query),
      ).rejects.toThrow(error);

      expect(
        mockTicketService.getRegistrationPlateNumberList,
      ).toHaveBeenCalledWith(query);
    });
  });

  describe('getRegistrationAllocatedSlotNumberList', () => {
    it('should get registration allocated slot number list', async () => {
      const query: getRegistrationDataList = {
        parkingLotId: 1,
        carSize: ECarSize.SMALL,
      };

      const mockResult = ['A01', 'A02'];

      mockTicketService.getRegistrationAllocatedSlotNumberList.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getRegistrationAllocatedSlotNumberList(
        query,
      );

      expect(
        mockTicketService.getRegistrationAllocatedSlotNumberList,
      ).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
    });

    it('should handle service errors', async () => {
      const query: getRegistrationDataList = {
        parkingLotId: 1,
        carSize: ECarSize.SMALL,
      };

      const error = new Error('Service error');
      mockTicketService.getRegistrationAllocatedSlotNumberList.mockRejectedValue(
        error,
      );

      await expect(
        controller.getRegistrationAllocatedSlotNumberList(query),
      ).rejects.toThrow(error);

      expect(
        mockTicketService.getRegistrationAllocatedSlotNumberList,
      ).toHaveBeenCalledWith(query);
    });
  });
});
