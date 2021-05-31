import { Controller, Inject, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from 'aws-sdk';

const BUCKET_NAME = "dooseongubereats0225";


@Controller("uploads")
export class UploadsController {
    constructor (
        @Inject('ACCESSKEYID') private readonly accessKeyId,
        @Inject('SECRETACCESSKEY') private readonly secretAccessKey,
    ) {
        AWS.config.update({
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        });
    }
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        try {
            // 먼저 아래 주석으로 AWS S3에 Bucket 생성해야한다.
            // const upload = await new AWS.S3().createBucket({
            //     Bucket:"dooseongubereats0225",
            // }).promise();
            const objectName = `${Date.now()+file.originalname}`;
            await new AWS.S3().putObject({
                Body: file.buffer,
                Bucket: BUCKET_NAME,
                Key: objectName,
                ACL:"public-read",
            }).promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return {url};
        } catch(e) {
            console.log(e);
            return null;   
            
        }
    }
}
 