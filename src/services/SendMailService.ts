import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {

    private client: Transporter

    // O CONSTRUTOR NÃO PERMITE A UTILIZAÇÃO DE ASYNC E AWAIT
    // POR ISSO O .THEN É UTILIZADO
    constructor() {
        nodemailer.createTestAccount().then(account => {

            // DOCUMENTAÇÃO DO NODEMAILER
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter;

        })
    }

    // FUNÇÕES QUE RETORNAM UMA PROMISE TEM O AWAIT => const resposta = await execute()

    async execute(to: string, subject: string, variables: object, path: string){

        
        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables);

        const message = await this.client.sendMail({

            to,
            subject,
            html,
            from: "NPS <noreply@nps.com.br>"

        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));

    }
}

export default new SendMailService();