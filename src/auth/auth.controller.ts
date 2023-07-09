import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/auth.dto';
// import { CustomerService } from 'src/customer/customer.service';

// type User = {
//   email: string;
// };

// @SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, // private readonly customerService: CustomerService,
  ) {}

  // @Post('signup')
  // async signup(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<User> {
  //   return this.authService.signup(loginDto);
  // }

  // @SkipAuth()
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

  // @Post('reset-password')
  // async resetPassword(
  //   @Body(new ValidationPipe()) loginDto: LoginDto,
  // ): Promise<{ token: { accessToken: string; refreshToken: string } }> {
  //   const token = await this.authService.login(
  //     loginDto.email,
  //     loginDto.password,
  //   );
  //   return { token };
  // }

  //   @Get('reset-password/:resetToken')
  //   async forgotPasswordVerify(
  //     @Param('resetToken') email: string,
  //     @Query('code') code: string,
  //   ): Promise<void> {
  //     const user = await this.customerService.getCustomer({ email });
  //     const isMatching = code === user[0].activationCode;
  //   }

  // @Post('refresh-token')
  // @UseGuards(AuthGuard('jwt'))
  // async refreshToken(
  //   @Body() refreshTokenDto: { refreshToken: string },
  // ): Promise<{ accessToken: string }> {
  //   const { refreshToken } = refreshTokenDto;
  //   const newAccessToken = await this.authService.refreshAccessToken(
  //     refreshToken,
  //   );
  //   return newAccessToken;
  // }
}
