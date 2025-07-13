import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guard/local-auth.guard';
import { IResponseLogin } from './interface/auth.interface';
import { Public } from '../common/decorator/common.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<IResponseLogin> {
    const result = await this.authService.login(req.user);
    return result;
  }
}
