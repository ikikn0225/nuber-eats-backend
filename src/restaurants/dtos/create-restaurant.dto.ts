import { ArgsType, Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { extend } from "joi";
import { CoreOutput } from "src/common/dtos/output.dto";
import { CoreEntity } from "src/common/entities/core.entity";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
    'name',
    'coverImg',
    'address',
]) {
    @Field(type => String)
    categoryName: string;
}


@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
