const sgMail = require("../config/sendgrid");
const Logger = require("../utils/logger");

// Email templates
const templates = {
   welcome: {
      subject: "Welcome to YoCodex!",
      html: (data) => `
      <h1>Welcome ${data.username}!</h1>
      <p>Thank you for joining YoCodex. Start sharing your coding journey!</p>
    `,
   },
   newFollower: {
      subject: "New Follower on YoCodex",
      html: (data) => `
      <h2>You have a new follower!</h2>
      <p>${data.followerName} started following you on YoCodex.</p>
    `,
   },
   newComment: {
      subject: "New Comment on Your Post",
      html: (data) => `
      <h2>Someone commented on your post!</h2>
      <p>${data.commenterName} commented on your post "${data.postTitle}":</p>
      <blockquote>${data.commentContent}</blockquote>
    `,
   },
   passwordReset: {
      subject: "Reset Your Password - YoCodex",
      html: (data) => `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${data.resetLink}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
   },
};

// Send email function
exports.sendEmail = async ({ to, template, data = {} }) => {
   try {
      if (!templates[template]) {
         throw new Error(`Email template '${template}' not found`);
      }

      const emailTemplate = templates[template];
      const msg = {
         to,
         from: process.env.FROM_EMAIL || "noreply@yocodex.com",
         subject: emailTemplate.subject,
         html: emailTemplate.html(data),
      };

      await sgMail.send(msg);
      Logger.info(`Email sent successfully to ${to}`, { template });
      return { success: true };
   } catch (error) {
      Logger.error(`Failed to send email to ${to}`, {
         template,
         error: error.message,
      });
      throw new Error(`Email sending failed: ${error.message}`);
   }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
   return this.sendEmail({
      to: user.email,
      template: "welcome",
      data: { username: user.username },
   });
};

// Send new follower notification
exports.sendNewFollowerEmail = async (user, follower) => {
   return this.sendEmail({
      to: user.email,
      template: "newFollower",
      data: { followerName: follower.username },
   });
};

// Send new comment notification
exports.sendNewCommentEmail = async (postAuthor, comment, post) => {
   return this.sendEmail({
      to: postAuthor.email,
      template: "newComment",
      data: {
         commenterName: comment.author.username,
         postTitle: post.title,
         commentContent: comment.content,
      },
   });
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
   return this.sendEmail({
      to: user.email,
      template: "passwordReset",
      data: { resetLink },
   });
};
