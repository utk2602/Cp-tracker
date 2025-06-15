const nodemailer =  require('nodemailer')
const EmailLog = require('../models/EmailLog');

class EmailService{
    constructor(){
        this.transporter =  nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: true,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASS
            }
        });
    }
    async sendInactivityReminder(student){
        try{
            const mailOptions={
                from: process.env.SMTP_FROM,
                to: student.email,
                subject:'Reminder:Continue Your Codeforces Journey!',
                html:`<h1>Hello ${student.name},</h1>
                    <p>We noticed you haven't made any submissions on Codeforces in the last 7 days.</p>
                    <p>Keep up the good work and continue solving problems to improve your skills!</p>
                    <p>Your current rating: ${student.currentRating}</p>
                    <p>Your max rating: ${student.maxRating}</p>
                    <p>Best regards,<br>Student Progress Management System</p>`
            };
            await this.transporter.sendMail(mailOptions);
            //loggin the email
            await EmailLog.create({
                student: student._id,
                emailType: 'INACTIVITY_REMINDER',
                status:'SENT'
            });
            return true;
        } catch(error){
            await EmailLog.create({
                student:student._id,
                emailType:'INACTIVITY_REMINDER',
                status:'FAILED',
                errorMessage:error.message
            });
            throw new Error(`Failed to send email to ${student.email}:${error.message}`);
        }
    }
}
module.exports = new EmailService();

