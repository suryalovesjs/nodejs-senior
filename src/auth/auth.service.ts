import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { CustomerService } from 'src/customer/customer.service';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerInputDto } from 'src/customer/dto/customer.input';
import { ROLES } from 'src/lib/enums';
import { compare, hash } from 'bcrypt';
import { Customer } from 'src/lib';

interface JwtPayload {
  userId: string;
  role: ROLES;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    // private readonly customerService: CustomerService,
    private prisma: PrismaService,
  ) {}

  async signup(createUserDto: Required<CreateCustomerInputDto>): Promise<any> {
    // // const newUser = await this.prisma.createCustomer(createUserDto);
    // return newUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.loginCustomer({ email });

    if (!user) {
      throw new BadRequestException('No User found');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id, user.role as any);
    const refreshToken = this.generateRefreshToken(user.id, user.role as any);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const payload = this.verifyRefreshToken(refreshToken);
    const accessToken = this.generateAccessToken(payload.userId, payload.role);
    return { accessToken };
  }

  private generateAccessToken(userId: string, role: ROLES): string {
    const payload = { userId, role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private generateRefreshToken(userId: string, role: ROLES): string {
    const payload = { userId, role };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private verifyRefreshToken(refreshToken: string): JwtPayload {
    try {
      return this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async loginCustomer({ email }: { email: string }): Promise<Customer> {
    return this.prisma.customer.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        activated: true,
        password: true,
        activationCode: true,
      },
    });
  }
}
