import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field({
    description: 'Activation',
  })
  activated: boolean;

  @Field({
    description: 'Activation code',
    nullable: true,
  })
  activationCode?: string;

  @Field({
    description: 'Password',
    nullable: true,
  })
  password?: string;

  @Field({
    description: 'Role of the user',
  })
  role: string;
}
