const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const logger = require("../utils/logger");

class EmailService {
   constructor() {
      this.transporter = nodemailer.createTransporter({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         secure: process.env.EMAIL_SECURE === "true",
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      });
   }

   async sendEmail(options) {
      try {
         const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
            text: options.text,
         };

         const result = await this.transporter.sendMail(mailOptions);
         logger.info(`Email sent successfully to ${options.email}`);
         return result;
      } catch (error) {
         logger.error("Error sending email:", error);
         throw error;
      }
   }

   async sendWelcomeEmail(user) {
      const template = await this.renderTemplate("welcome", {
         name: user.firstName || user.username,
         email: user.email,
         loginUrl: `${process.env.FRONTEND_URL}/login`,
      });

      return this.sendEmail({
         email: user.email,
         subject: "Welcome to YoCodex!",
         html: template,
      });
   }

   async sendPasswordResetEmail(user, resetToken) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const template = await this.renderTemplate("password-reset", {
         name: user.firstName || user.username,
         resetUrl,
         expiresIn: "10 minutes",
      });

      return this.sendEmail({
         email: user.email,
         subject: "Password Reset Request",
         html: template,
      });
   }

   async sendEmailVerification(user, verificationToken) {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      const template = await this.renderTemplate("email-verification", {
         name: user.firstName || user.username,
         verificationUrl,
      });

      return this.sendEmail({
         email: user.email,
         subject: "Verify Your Email Address",
         html: template,
      });
   }

   async renderTemplate(templateName, data) {
      const templatePath = path.join(__dirname, "../templates/emails", `${templateName}.ejs`);
      return ejs.renderFile(templatePath, data);
   }
}

module.exports = new EmailService();
