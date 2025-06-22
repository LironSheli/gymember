import nodemailer from "nodemailer";

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "no-reply@gymember.brightsite.co.il",
    pass: process.env.EMAIL_PASSWORD || "",
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  passwordReset: (userEmail: string, resetLink: string) => ({
    subject: "Password Reset Request - Gymember",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Gymember</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Password Reset Request</p>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello!</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Gymember account (${userEmail}).
          </p>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Click the button below to reset your password. This link will expire in 1 hour.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            If you didn't request this password reset, you can safely ignore this email. 
            Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This email was sent from Gymember. If you have any questions, please contact support.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request - Gymember
      
      Hello!
      
      We received a request to reset your password for your Gymember account (${userEmail}).
      
      Click the following link to reset your password (this link will expire in 1 hour):
      ${resetLink}
      
      If you didn't request this password reset, you can safely ignore this email.
      Your password will remain unchanged.
      
      Best regards,
      The Gymember Team
    `,
  }),

  welcome: (userEmail: string, _?: string) => ({
    subject: "Welcome to Gymember!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Gymember</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Welcome to Your Fitness Journey</p>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Gymember! 🎉</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining Gymember! We're excited to help you track your fitness journey and achieve your goals.
          </p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin-top: 0;">What you can do with Gymember:</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Track your workouts and exercises</li>
              <li>Monitor your progress over time</li>
              <li>View detailed workout history</li>
              <li>Set and achieve fitness goals</li>
            </ul>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            Start your fitness journey today by logging your first workout!
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            Welcome to the Gymember family! If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to Gymember!
      
      Thank you for joining Gymember! We're excited to help you track your fitness journey and achieve your goals.
      
      What you can do with Gymember:
      - Track your workouts and exercises
      - Monitor your progress over time
      - View detailed workout history
      - Set and achieve fitness goals
      
      Start your fitness journey today by logging your first workout!
      
      Best regards,
      The Gymember Team
    `,
  }),

  passwordChanged: (userEmail: string, _?: string) => ({
    subject: "Password Changed Successfully - Gymember",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Gymember</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Password Changed Successfully</p>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Changed Successfully</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Your password for your Gymember account (${userEmail}) has been successfully changed.
          </p>
          <div style="background-color: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #065f46; margin: 0; font-weight: bold;">✅ Password change confirmed</p>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">
            If you did not make this change, please contact our support team immediately.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated message from Gymember. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Changed Successfully - Gymember
      
      Your password for your Gymember account (${userEmail}) has been successfully changed.
      
      ✅ Password change confirmed
      
      If you did not make this change, please contact our support team immediately.
      
      Best regards,
      The Gymember Team
    `,
  }),
};

// Email sending functions
export const sendEmail = async (
  to: string,
  template: keyof typeof emailTemplates,
  data?: any
) => {
  try {
    const emailTemplate = emailTemplates[template];
    let emailContent;

    if (template === "passwordReset" && typeof emailTemplate === "function") {
      if (!data.userEmail || !data.resetLink) {
        throw new Error("Missing required data for password reset email");
      }
      emailContent = emailTemplate(data.userEmail, data.resetLink);
    } else if (template === "welcome" && typeof emailTemplate === "function") {
      if (!data.userEmail) {
        throw new Error("Missing required data for welcome email");
      }
      emailContent = emailTemplate(data.userEmail, "");
    } else if (
      template === "passwordChanged" &&
      typeof emailTemplate === "function"
    ) {
      if (!data.userEmail) {
        throw new Error("Missing required data for password changed email");
      }
      emailContent = emailTemplate(data.userEmail, "");
    } else {
      throw new Error("Invalid email template or missing data");
    }

    const mailOptions = {
      from: `"Gymember" <${emailConfig.auth.user}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Specific email functions
export const sendPasswordResetEmail = async (
  userEmail: string,
  resetToken: string
) => {
  const resetLink = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;
  return await sendEmail(userEmail, "passwordReset", { userEmail, resetLink });
};

export const sendWelcomeEmail = async (userEmail: string) => {
  return await sendEmail(userEmail, "welcome", { userEmail });
};

export const sendPasswordChangedEmail = async (userEmail: string) => {
  return await sendEmail(userEmail, "passwordChanged", { userEmail });
};
