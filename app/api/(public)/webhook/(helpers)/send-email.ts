import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { validate } from "uuid";

export const sendMail = async (
  from:string,
  firstName:string,
  lastname:string,
  subject:string | '',
 text:string,
  toEmail: string,
  toName: string,
  type:string
) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.NEXT_PUBLIC_MAILER_API!,
  });

  const sentFrom = new Sender("info@solsoft.nl", "admin");

  const recipients = [new Recipient(toEmail, toName)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(type)
    .setHtml(`<strong>${subject}</strong>
    <div>
    <p>  user firstname: ${firstName}</p>
    <p>  user lastname: ${lastname}</p>
    <p>  user email: ${from}</p>
    <p>  user message: ${text}</p>
    </div>
    
    `)
    .setText(`
    user name: ${firstName}
    second name:${lastname}
    user email: ${from}
    subject: ${text}
    `);

  await mailerSend.email.send(emailParams);
};
