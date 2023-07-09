import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class JwtStrategy {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      this.logger.log('Decoded token', decoded);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
