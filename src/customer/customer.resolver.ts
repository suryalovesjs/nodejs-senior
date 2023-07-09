import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { CreateCustomerInputDto, GetCustomerInput } from './dto/customer.input';
import { ROLES, Roles } from 'src/lib';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  @Roles(ROLES.USER)
  async customers(@Args('data') { where }: GetCustomerInput) {
    return this.customerService.getCustomer(where);
  }

  @Mutation(() => Customer)
  @Roles(ROLES.ADMIN)
  async createCustomer(@Args('data') data: CreateCustomerInputDto) {
    return this.customerService.createCustomer(data);
  }

  @Mutation(() => Customer)
  @Roles(ROLES.ADMIN)
  async updateCustomer(
    @Args('id') id: string,
    @Args('data') data: CreateCustomerInputDto,
  ) {
    return this.customerService.updateCustomer({ id, data });
  }

  @Mutation(() => Customer)
  @Roles(ROLES.ADMIN)
  async deleteCustomer(@Args('id') id: string) {
    return this.customerService.deleteCustomer({ id });
  }
}
