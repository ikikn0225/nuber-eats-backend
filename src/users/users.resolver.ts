import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/role.decorator";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-email.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";


@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService){}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput,
    ):Promise<CreateAccountOutput>{
        return this.userService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    async login(
        @Args('input') loginInput: LoginInput
    ): Promise<LoginOutput> {
        return this.userService.login(loginInput);
    } 

    @Query(returns=>User)
    @Roles(["Any"])
    me(@AuthUser() authUser:User) {
        return authUser;
    }

    @Roles(["Any"])
    @Query(returns=>UserProfileOutput)
    async userProfile(@Args() userProfileInput:UserProfileInput): Promise<UserProfileOutput> {
        return this.userService.findById(userProfileInput.userId); 
    }

    @Roles(["Any"])
    @Mutation(returns=>EditProfileOutput)
    async editProfile(
        @AuthUser() authUser:User,
        @Args('input') editProfileInput: EditProfileInput,)
    :Promise<EditProfileOutput> {
        try {
            await this.userService.editProfile(authUser.id, editProfileInput)
            return {
                ok:true
            }
        } catch (error) {
            return {
                ok: false,
                error
            };
        }
    }

    @Mutation(returns=>VerifyEmailOutput)
    verifyEmail(@Args('input') {code}:VerifyEmailInput):Promise<VerifyEmailOutput> {
            return this.userService.verifyEmail(code);
    }


}