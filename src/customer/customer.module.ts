import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerResolver } from './customer.resolver';
import { CustomerController } from './customer.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/role.guard';
import { AuthenticationMiddleware } from 'src/middlewares/authentication.middleware';
import { JwtStrategy } from 'src/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PrismaService,
    JwtStrategy,
    CustomerResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
