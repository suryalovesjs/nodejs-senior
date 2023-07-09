import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerInputDto } from './dto/customer.input';
import { PrismaService } from '../prisma.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, PrismaService], // Include PrismaService as a provider
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  describe('findUserById', () => {
    it('should return the customer with the given ID', async () => {
      const customerId = '123';
      const customer = {
        id: customerId,
        name: 'John Doe',
        email: 'join.doe@gmail.com',
        role: 'USER',
        activated: false,
        activationCode: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'getCustomer').mockResolvedValue(customer);

      const result = await controller.findUserById(customerId);

      expect(service.getCustomer).toHaveBeenCalledWith({ id: customerId });
      expect(result).toEqual(customer);
    });
  });

  describe('findUserByEmail', () => {
    it('should return the customer with the given email', async () => {
      const email = 'join.doe@gmail.com';
      const customer = {
        id: '123',
        name: 'John Doe',
        email,
        role: 'USER',
        activated: false,
        activationCode: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'getCustomer').mockResolvedValue(customer);

      const result = await controller.findUserByEmail(email);

      expect(service.getCustomer).toHaveBeenCalledWith({ email });
      expect(result).toEqual(customer);
    });
  });

  describe('findAllUsers', () => {
    it('should return all customers', async () => {
      const customers = [
        { id: '123', name: 'John Doe' },
        { id: '456', name: 'Jane Smith' },
      ];

      jest.spyOn(service, 'getAllCustomers').mockResolvedValue(customers);

      const result = await controller.findAllUsers();

      expect(service.getAllCustomers).toHaveBeenCalled();
      expect(result).toEqual(customers);
    });
  });

  describe('createUser', () => {
    it('should create a new customer', async () => {
      const userData: CreateCustomerInputDto = {
        email: 'john@example.com',
        password: 'test123',
      };
      const createdCustomer = { id: '123', ...userData };

      jest.spyOn(service, 'createCustomer').mockResolvedValue(createdCustomer);

      const result = await controller.createUser(userData);

      expect(service.createCustomer).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdCustomer);
    });
  });

  describe('updateUser', () => {
    it('should update the customer with the given ID', async () => {
      const customerId = '123';
      const userData: CreateCustomerInputDto = {
        email: 'john@example.com',
        password: 'test123',
      };
      const updatedCustomer = {
        id: customerId,
        ...userData,
        ...{ role: 'USER' },
      };

      jest.spyOn(service, 'updateCustomer').mockResolvedValue(updatedCustomer);

      const result = await controller.updateUser(customerId, userData);

      expect(service.updateCustomer).toHaveBeenCalledWith({
        id: customerId,
        data: userData,
      });
      expect(result).toEqual(updatedCustomer);
    });
  });

  describe('deleteUser', () => {
    it('should delete the customer with the given ID', async () => {
      const customerId = '123';

      jest.spyOn(service, 'deleteCustomer').mockResolvedValue({
        id: customerId,
        role: 'USER',
        email: 'test@gmail.com',
      });

      const result = await controller.deleteUser(customerId);

      expect(service.deleteCustomer).toHaveBeenCalledWith({ id: customerId });
      expect(result).toEqual({
        email: 'test@gmail.com',
        id: '123',
        role: 'USER',
      });
    });
  });
});
