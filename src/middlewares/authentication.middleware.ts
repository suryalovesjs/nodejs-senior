import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import { JwtStrategy } from 'src/jwt.strategy';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: JwtStrategy,
    private readonly customerService: CustomerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = await this.authService.verifyToken(token);
      const user = await this.customerService.getCustomer({
        id: decoded.userId,
      });

      req['user'] = user;
    } catch (error) {
      this.logger.error('Error Validating token', error);
    }

    next();
  }
}
