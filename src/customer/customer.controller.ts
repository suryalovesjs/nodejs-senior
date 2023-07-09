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
import { Customer, ROLES, Roles } from 'src/lib';

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

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userData: CreateCustomerInputDto) {
    return this.customerService.createCustomer(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: CreateCustomerInputDto,
  ) {
    return this.customerService.updateCustomer({ id, data: userData });
  }

  @Delete()
  async deleteUser(@Query() params: { id: string }) {
    const { id } = params;

    if (!id) {
      throw new Error('No valid ID customer deletion.');
    }

    return this.customerService.deleteCustomer({ id });
  }
}
