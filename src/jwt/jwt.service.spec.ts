import { Test } from "@nestjs/testing";
import { UserService } from "src/users/users.service"
import { JwtModule } from "./jwt.module";
import * as jwt from "jsonwebtoken";
import { JwtService } from "./jwt.service";
import { CONFIG_OPTIONS } from 'src/common/common.constants';

const TEST_KEY = 'testKey';

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => 'TOKEN'),
    };
});

describe('JwtService', () => {
    let service: JwtService;

    beforeEach(async() =>{
        const module = await Test.createTestingModule({
            providers:[JwtService,
            {
                provide:CONFIG_OPTIONS,
                useValue:{privateKey:TEST_KEY},
            },
            ],
        }).compile();
        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
    
    describe('sign', () => {
        it('should return a signed token', async() => {
            const ID = 1;
            const token = service.sign(1);
            expect(typeof token).toBe("string");
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenCalledWith({id: ID}, TEST_KEY);
        });
    });
    describe('verify', () => {
        it('should return the decoded token', async() => {

        });
    });
});