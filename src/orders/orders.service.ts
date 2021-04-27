import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";

 

 @Injectable()
 export class OrderService {
     constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
     ) {}

     async createOrder(customer:User, {restaurantId, items}:CreateOrderInput): Promise<CreateOrderOutput> {
        const restaurant = await this.restaurant.findOne(restaurantId);
        if(!restaurant) {
            return {
                ok:false,
                error:"Restaurant not found",
            }
        }
        const order = await this.orders.save(this.orders.create({
            customer,
        }),
        );
        console.log(order);
        
     }
 }