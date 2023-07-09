import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RolesGuard } from 'src/role.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private readonly customerService: CustomerService,
  ) {}

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

  @Post('refresh-token')
  @UseGuards(RolesGuard)
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
