import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendMail = async (
 subject:string,
 text:string,
  toEmail: string,
  toName: string
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
    .setSubject(subject)
    .setHtml(`<strong>${text}</strong>`)
    .setText(text);

  await mailerSend.email.send(emailParams);
};
