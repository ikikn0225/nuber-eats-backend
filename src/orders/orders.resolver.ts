import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dto/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dto/get-order.dto";
import { GetOrdersInput, GetOrdersOutput } from "./dto/get-orders.dto";
import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";

const pubsub = new PubSub();

@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly ordersService: OrdersService) {

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
  potatoReady() {
      pubsub.publish('hot', {orderSubscription:"Your potato is ready. love you~~~!!"},);
      return true;
  }


  @Subscription(returns => String)
  @Role(['Any'])
  orderSubscription(@AuthUser() user:User) {
      console.log(user);
      
      return pubsub.asyncIterator('hot');
  }
}
