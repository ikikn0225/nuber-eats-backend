import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { PUB_SUB } from "src/common/common.constants";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly ordersService: OrdersService, @Inject(PUB_SUB) private readonly pubsub:PubSub,) {

    }

    @Mutation(returns => CreateOrderOutput)
    @Role(["Client"])
    async createOrder(
        @AuthUser() customer:User,
        @Args("input") 
        createOrderInput: CreateOrderInput,
    ):Promise<CreateOrderOutput> {
        return this.ordersService.createOrder(customer, createOrderInput);
    }

    @Query(returns => GetOrdersOutput)
    @Role(['Any'])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput);
    }

    @Query(returns => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation(returns => EditOrderOutput)
  @Role(['Owner', 'Delivery'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation(returns => Boolean)
  async potatoReady(@Args('potatoId') potatoId:number) {
      await this.pubsub.publish('hot', {orderSubscription:potatoId},);
      return true;
  }


  @Subscription(returns => String, {
    filter:({orderSubscription}, {potatoId}, context) => {
        return orderSubscription === potatoId;
    },
    })
  @Role(['Any'])
  orderSubscription(@Args('potatoId') potatoId:number) {
      return this.pubsub.asyncIterator('hot');
  }
}
