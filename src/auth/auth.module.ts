import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/users/users.module';
import { AuthUser } from './auth-user.decorator';
import { AuthGuard } from './auth.guard';

@Module({
    imports:[UserModule],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }]
})
export class AuthModule {}
