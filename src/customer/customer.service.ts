import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerInputDto } from './dto/customer.input';
import { hash } from 'bcrypt';
import { Customer, ROLES } from 'src/lib';
import { generateRandomCode } from 'src/lib';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private prisma: PrismaService) {}

  async getCustomer({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }): Promise<Customer> {
    this.logger.log(`Email:: ${email}`);
    const customers = await this.prisma.customer.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            id,
          },
        ],
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        activated: true,
        activationCode: true,
        updatedAt: true,
      },
    });

    return customers;
  }

  async authenticateCustomer({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    return this.prisma.customer.findFirst({
      where: {
        email,
        password: await hash(password, 10),
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
  async getAllCustomers(): Promise<any> {
    return await this.prisma.customer.findMany();
  }

  async createCustomer(
    user: CreateCustomerInputDto,
  ): Promise<CreateCustomerInputDto> {
    const { password, ...userData } = user;
    const hashedPassword = await hash(password, 10);
    const activationCode = generateRandomCode(5);

    const newUser = await this.prisma.customer.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: ROLES.USER,
        activationCode,
      },
    });

    return newUser;
  }

  async activateCustomer({ email }: { email: string }): Promise<any> {
    return this.prisma.customer.update({
      where: {
        email,
      },
      data: {
        activated: true,
      },
    });
  }

  async updateCustomer({
    id,
    data,
  }: {
    id: string;
    data: CreateCustomerInputDto;
  }) {
    if (!id) {
      throw new Error('No valid ID provided for customer update.');
    }

    if (!data) {
      throw new Error('No data');
    }

    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }
  async deleteCustomer({ id }: { id: string }) {
    if (!id) {
      throw new Error('No id provided for customer deletion.');
    }

    return this.prisma.customer.delete({ where: { id } });
  }
}
