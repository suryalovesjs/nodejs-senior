import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should create a new user and return the user details', async () => {
      const createUserDto: Required<LoginDto> = {
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = {
        id: '123',
        role: 'USER',
        activated: false,
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(createdUser);

      const result = await controller.signup(createUserDto);

      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should return an access token and refresh token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(result).toEqual({ token: tokens });
    });
  });

  describe('verifyAccount', () => {
    it('should verify the account and return the customer details', async () => {
      const activationCode = '12345';
      const customer = {
        id: '123',
        activated: true,
      };

      jest.spyOn(authService, 'verifyAccount').mockResolvedValue(customer);

      const result = await controller.verifyAccount(activationCode);

      expect(authService.verifyAccount).toHaveBeenCalledWith(activationCode);
      expect(result).toEqual(customer);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token', async () => {
      const refreshToken = 'refresh-token';
      const accessToken = 'access-token';

      jest
        .spyOn(authService, 'refreshAccessToken')
        .mockResolvedValue({ accessToken });

      const result = await controller.refreshAccessToken(refreshToken);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual({ accessToken });
    });
  });
});
