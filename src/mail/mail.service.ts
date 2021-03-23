import got from "got/dist/source";
import * as FormData from "form-data";
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { MailModuleOptions, EmailVar } from "./mail.interface";

@Injectable()
export class  MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
    ) {
        // this.sendEmail('testing','test').then(()=>{
        //     console.log("Message sent");
        //     }).catch((error)=>{
        //     console.log(error.response.body);
        //     });
    }

    private async sendEmail(subject:string, template:string, emailVars:EmailVar[]) {
        const form = new FormData();
        form.append("from", `DooSeong from Nuber Eats <mailgun@${this.options.domain}>`);
        form.append("to", `wsx2792@gmail.com`);
        form.append("subject", subject);
        form.append("template", template);
        emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        try {
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, 
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
        } catch (error) {
            console.log(error);
        }
    }

    sendVerificationEmail(email:string, code:string) {  
        this.sendEmail('Verify Your Email', 'verify-email',[
            {key:'code', value:code},
            {key:'username', value:email},
        ]);
    }
}
