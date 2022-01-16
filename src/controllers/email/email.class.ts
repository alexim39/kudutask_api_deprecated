import nodemailer from 'nodemailer'
import {UserInterface} from './../../models/auth/user.interface';

export class EmailClass { 
  
  constructor() {}

  send(recipients: string[], subject: string, body: string) {

    let transporter = nodemailer.createTransport({
      host: 'mail.kudutask.com', //"smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@kudutask.com',
        pass: '$ch00ltraz'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const mailOptions = {
      from: 'Kudutask <noreply@kudutask.com>',
      to: recipients,
      subject: subject,
      html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.log(error)
        return error;
      } else {
        //console.log(info)
        return info;
      }
    })
  }

  sendAccountActivationLink(user: UserInterface) {

    // send account activation mail
    // http://kudutask.com/signup/${user._id}
    // http://localhost:4200/signup/${user._id}


    const emails: string[] = [];
    emails.push(user.email);

    // email body
    const emailBody: string = `
    <h1>Welcome To Kudutask</h1>
    <p> Hi ${user.lastname} ${user.firstname},</p>
    <p>Kindly use the link below to activate your account, to enable you get full access to features in Kudutask</p>
    <br>
    <a href="http://localhost:4200/signup/${user._id}" target="_blank" 
        style="background-color: #4A2781; 
        color: white; 
        padding: 15px 32px;
        text-decoration: none;
        text-align: center;
        border: 1px solid gray; 
        font-size: 16px;
        text-transform: uppercase;
        display: inline-block;">Activate Account</a>
    <p>From Kudutask</p> `;
    // email class
    //const email: EmailClass = new EmailClass();
    // send email
    this.send(emails, 'Account Activation', emailBody);
  }

}