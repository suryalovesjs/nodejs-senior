import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RolesGuard } from '../role.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body(new ValidationPipe()) createUserDto: Required<LoginDto>,
  ): Promise<{ id: string; role: string; activated: boolean }> {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
  ): Promise<{ token: { accessToken: string; refreshToken: string } }> {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return { token };
  }

  @Get('verify/:activationCode')
  async verifyAccount(
    @Param('activationCode') activationCode: string,
  ): Promise<{ id: string; activated: boolean }> {
    const customer = await this.authService.verifyAccount(activationCode);
    return customer;
  }

  @Post('refresh-token')
  @UseGuards(RolesGuard)
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
