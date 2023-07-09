import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { CreateCustomerInputDto, GetCustomerInput } from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { where }: GetCustomerInput) {
    return this.customerService.getCustomer(where);
  }

  @Mutation(() => Customer)
  async createCustomer(@Args('data') data: CreateCustomerInputDto) {
    return this.customerService.createCustomer(data);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('id') id: string,
    @Args('data') data: CreateCustomerInputDto,
  ) {
    return this.customerService.updateCustomer({ id, data });
  }

  @Mutation(() => Customer)
  async deleteCustomer(@Args('id') id: string) {
    return this.customerService.deleteCustomer({ id });
  }
}
