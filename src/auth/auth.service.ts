import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { CreateCustomerInputDto } from 'src/customer/dto/customer.input';
import { ROLES } from '../lib/enums';
import { compare, hash } from 'bcrypt';
import { generateRandomCode } from '../lib';

interface JwtPayload {
  userId: string;
  role: ROLES;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(
    createUserDto: CreateCustomerInputDto,
  ): Promise<{ id: string; role: string; activated: boolean }> {
    const activationCode = generateRandomCode(5);
    const hashedPassword = await hash(createUserDto.password, 10);

    const newUser = await this.prisma.customer.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        activationCode,
      },
    });

    const { id, role, activated } = newUser;

    return { id, role, activated };
  }

  async verifyAccount(
    activationCode: string,
  ): Promise<{ id: string; activated: boolean }> {
    const customer = await this.prisma.customer.findFirst({
      where: { activationCode },
    });

    if (!customer) {
      throw new BadRequestException('Invalid activation code');
    }

    const { id, activated } = await this.prisma.customer.update({
      where: { id: customer.id },
      data: { activated: true },
    });

    return { id, activated };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.customer.findFirst({
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

    if (!user) {
      throw new BadRequestException('No User found');
    }

    if (!user.activated) {
      throw new UnauthorizedException(
        'Account not activated. Please activate your account before attempting to login.',
      );
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
}
