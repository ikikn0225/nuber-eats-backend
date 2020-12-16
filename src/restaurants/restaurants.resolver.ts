import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dtos/update-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";

//리졸버는 쿼리에서 특정 필드에 대한 요청이 있을 때, 그것을 어떤 로직으로 처리할지 GraphQL에게 알려주는 역할을 맡습니다.
@Resolver(of => Restaurant)
export class RestaurantResolver{
    constructor(private readonly restaurantService: RestaurantService) {}
    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Boolean)
    async createRestaurant( @Args('input') createRestaurantDto:CreateRestaurantDto ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        } 
    }

    @Mutation(returns => Boolean)
    async updateRestaurant( @Args('input') updateRestaurantDto :UpdateRestaurantDto ): Promise<boolean> {
        try {
            await this.restaurantService.updateRestaurant(updateRestaurantDto);
            return true;
        } catch (error) {
            return false;
        }
    }
}