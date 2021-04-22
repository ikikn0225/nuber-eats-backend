import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository, TreeLevelColumn } from "typeorm";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurants.dto";
import { Category } from "./entities/category.entity";
import { Restaurant } from "./entities/restaurant.entity";
import { CategoryRepository } from "./repositories/category.repository";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants:Repository<Restaurant>,
        private readonly categories:CategoryRepository
    ) {}

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(createRestaurantInput.categoryName,);
            newRestaurant.category = category;

            await this.restaurants.save(newRestaurant);
            return {
                ok:true,
            }
        } catch {
            return {
                ok: false,
                error: "Could not create restaurant.",
            };
        }
    }

    async editRestaurant(
        owner:User, 
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(editRestaurantInput.restaurantId,);
            console.log(restaurant);
            
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                };
            }
            if(owner.id !== restaurant.ownerId) {
                return {
                    ok:false,
                    error: "You cannot edit a restaurant that you do not own",
                }
            }
            let category: Category = null;
            if(editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName,
                );
            }
            await this.restaurants.save([{
                id:editRestaurantInput.restaurantId,
                ...editRestaurantInput,
                ...(category && { category }),
            }]);
            return {
                ok:true,
            };
        } catch (error) {
            return {
                ok:false,
                error: "error!",
            }
        }
    }

    async deleteRestaurant(owner:User, {restaurantId}:DeleteRestaurantInput,): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId,);
            
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                };
            }
            if(owner.id !== restaurant.ownerId) {
                return {
                    ok:false,
                    error: "You cannot delete a restaurant that you do not own",
                }
            }
            await this.restaurants.delete(restaurantId);
            return {
                ok:true,
            }
        } catch (error) {
            return {
                ok: false,
                error: "Could not delete restaurant.",
            }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories
            }
        } catch (error) {
            return {
                ok:false,
                error: "Could not load categories.",
            }
        }
    }

    countRestaurant(category:Category) {
        return this.restaurants.count({category});
    }

   async findCategoryBySlug({ slug, page }:CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({slug},);
            console.log(category);
            
            if(!category) {
                return {
                    ok:false,
                    error:'Category not found',
                };
            }
            const restaurants = await this.restaurants.find({
                where:{
                    category,
                },
                take:25,
                skip: (page - 1) * 25,
            });
            const totalResults = await this.countRestaurant(category);
            return {
                ok:true,
                category,
                totalPages: Math.ceil(totalResults / 25),
            }
        } catch (error) {
            return {
                ok: false,
                error: 'Could not load category',
            }
        }
    }

    async allRestaurants({page}:RestaurantInput):Promise<RestaurantOutput> {
        try {
            const[results, totalResults] = await this.restaurants.findAndCount({
                skip: (page-1) * 25,
                take: 25,
            });
            return {
                ok:true,
                results,
                totalPages: Math.ceil(totalResults / 25),
                totalResults,
            }
        } catch (error) {
            return {
                ok:false,
                error:'Could not found restaurants',
            }
        }
    }

}