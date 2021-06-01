import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { FileInterceptor } from '@nestjs/platform-express';
  import * as AWS from 'aws-sdk';
  
  const BUCKET_NAME = 'dooseongubereats0225';
  
  @Controller('uploads')
  export class UploadsController {
    constructor(private readonly configService: ConfigService) {}
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
      AWS.config.update({
        credentials: {
          accessKeyId: this.configService.get('AWS_KEY'),
          secretAccessKey: this.configService.get('AWS_SECRET'),
        },
      });
      try {
          // 먼저 아래 주석으로 AWS S3에 Bucket 생성해야한다.
            // const upload = await new AWS.S3().createBucket({
            //     Bucket:"dooseongubereats0225",
            // }).promise();
        const objectName = `${Date.now() + file.originalname}`;
        await new AWS.S3()
          .putObject({
            Body: file.buffer,
            Bucket: BUCKET_NAME,
            Key: objectName,
            ACL: 'public-read',
          })
          .promise();
        const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
        return { url };
      } catch (e) {
        return null;
      }
    }
<<<<<<< HEAD
  } 
=======
  }
>>>>>>> 308b6e79873b918e10e919da794f42e058242f01
