import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerInputDto } from './dto/customer.input';
import { Customer, ROLES, Roles } from '../lib';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Roles(ROLES.USER)
@Controller('customer')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomer({ id });
  }

  @Get()
  async findUserByEmail(@Query('email') email: string): Promise<Customer> {
    this.logger.log(`Email:: ${email}`);
    return this.customerService.getCustomer({ email });
  }

  @Roles(ROLES.ADMIN)
  @Get('get/all')
  async findAllUsers(): Promise<Customer[]> {
    return this.customerService.getAllCustomers();
  }

  @ApiOperation({ summary: 'Create Customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully!' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Roles(ROLES.ADMIN)
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userData: CreateCustomerInputDto) {
    return this.customerService.createCustomer(userData);
  }

  @Roles(ROLES.ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: CreateCustomerInputDto,
  ) {
    return this.customerService.updateCustomer({ id, data: userData });
  }

  @Roles(ROLES.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    if (!id) {
      throw new Error('No valid ID customer deletion.');
    }

    return this.customerService.deleteCustomer({ id });
  }
}
