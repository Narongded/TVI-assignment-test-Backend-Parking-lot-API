import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../common/guard/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../common/guard/jwt.strategy';
import { TicketJwtStrategy } from '../common/guard/ticket-jwt.strategy';

@Module({
  imports: [
    AdminUserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.get('jwt');
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, TicketJwtStrategy],
})
export class AuthModule {}
