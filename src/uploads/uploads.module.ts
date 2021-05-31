import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

@Module({
    providers: [
        {
            provide:"ACCESSKEYID",
            useValue:"AKIAUDNHOFWYLBHL7NFB"
        },
        {
            provide:"SECRETACCESSKEY",
            useValue:"KnQLWnoqzFki4Be0Nod5VNRoGk0122VYcmnoKK+T"
        }
    ],
    controllers: [UploadsController]
})
export class UploadsModule {}
