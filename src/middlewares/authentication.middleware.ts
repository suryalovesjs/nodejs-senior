import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from 'src/customer/customer.service';
// import { AuthService } from './auth.service';
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
    this.logger.log('Tokennn in middlware', req.headers.authorization);
    if (token) {
      try {
        const decoded = await this.authService.verifyToken(token);
        const user = await this.customerService.getCustomer({
          id: decoded.userId,
        });

        this.logger.log('User info', user);
        req['user'] = user; // Attach the user object to the request
      } catch (error) {
        // Handle token verification error
        this.logger.error('Error Validating token', error);
      }
    }

    next();
  }
}
