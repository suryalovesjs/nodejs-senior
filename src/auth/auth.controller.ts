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
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({ status: 201, description: 'User successfully signed up' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('signup')
  async signup(
    @Body(new ValidationPipe()) createUserDto: Required<LoginDto>,
  ): Promise<{ id: string; role: string; activated: boolean }> {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Verify Account' })
  @ApiResponse({ status: 200, description: 'Account verified successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('verify/:activationCode')
  async verifyAccount(
    @Param('activationCode') activationCode: string,
  ): Promise<{ id: string; activated: boolean }> {
    const customer = await this.authService.verifyAccount(activationCode);
    return customer;
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('refresh-token')
  @UseGuards(RolesGuard)
  async refreshAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
