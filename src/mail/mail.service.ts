import got from "got/dist/source";
import * as FormData from "form-data";
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { MailModuleOptions } from "./mail.interface";

@Injectable()
export class  MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {
        this.sendEmail('testing','test').then(()=>{
            console.log("Message sent");
            }).catch((error)=>{
            console.log(error.response.body);
            });
    }

    private async sendEmail(subject:string, contents:string) {
        const form = new FormData();
        form.append("from", `Excited User <mailgun@${this.options.domain}>`);
        form.append("to", `wsx2792@gmail.com`);
        form.append("subject", subject);
        form.append("text", contents);
        const response = await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, 
            {
                method:"POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `api:${this.options.apiKey}`
                    ).toString('base64')}`,
                },
                body:form,
            },
        );
        console.log(response.body);
        
    }
}
