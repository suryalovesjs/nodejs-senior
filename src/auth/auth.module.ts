import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
