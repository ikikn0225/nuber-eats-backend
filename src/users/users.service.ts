import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { ok } from "assert";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";
import { UserProfileOutput } from "./dtos/user-profile.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users:Repository<User>,
        @InjectRepository(Verification) private readonly verifications:Repository<Verification>,
        private readonly jwtservice: JwtService,
    ) { }

    async createAccount({email, password, role}: CreateAccountInput): Promise<{ok: boolean, error?: string}> {
        try {
            const exists = await this.users.findOne({email});
            if(exists) {
                return {ok: false, error: 'There is a user with that email already'};
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verifications.save(
                this.verifications.create({
                    user,
                })
            );
            return {ok: true};
        } catch (e) {
            return {ok: false, error: 'Could not create account'};
        }

        //check new user
        //create user & hash the password
    }

    async login({email, password}: LoginInput): Promise<{ok: boolean, error?: string, token?: string}> {
        //find the user with email
        //check if the password is correct
        //make a JWT and give it to the user
        try {
            const user = await this.users.findOne({ email }, {select:["id", "password"]});
            if(!user) {
                return {
                    ok:false,
                    error: "User not found",
                }
            }
            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect) {
                return {
                    ok: false,
                    error: "Wrong password",
                }
            }
            console.log(user);
            
            const token = this.jwtservice.sign(user.id);
            return {
                ok: true,
                token,
            };
        } catch (error) {
            return {
                ok: false,
                error,
            };
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne({id});
            if(user) {
                return {
                    ok:true,
                    user:user,
                };
            }
        } catch (error) {
            return {ok:false, error:'User not found.'}
        }
    }

    async editProfile(userId:number, {email, password}:EditProfileInput):Promise<User> {
        const user = await this.users.findOne(userId);
        if(email) {
            user.email      = email;
            user.verified   = false;
            await this.verifications.save(this.verifications.create({user}));
        }       
        if(password)    user.password   = password;
        return this.users.save(user);
    }

    async verifyEmail(code:string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne({code}, {relations:["user"]});
            if(verification) {
                verification.user.verified = true;
                await this.users.save(verification.user);
                await this.verifications.delete(verification.id);
                return {ok:true};
            }
            return {ok:false, error:'verification not found.'};
        } catch (error) {
            return {ok:false, error};
        }
    }
}