import { Resend } from "resend";
const RESEND_API_KEY =
  (process.env.RESEND_API_KEY as string) ||
  "re_UnbMd7D2_NrJ4Kq9gbN3B8U2ceKHpu1HV";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@cappadociaplatform.com";
const resend = new Resend(RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, otp: string) => {
  try {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px; display:flex; justify-content:start; gap:10px; align-items:center">
      <img src="https://res.cloudinary.com/sage-media/image/upload/v1761809447/logo_olblxe.png" alt="Cappadocia Logo" 
           style="max-width: 120px; margin-bottom: 10px;" />
    </div>
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>You requested a password reset for your account.</p>
    <p>Use the following OTP code to reset your password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #f8f9fa; border: 2px dashed #b32053; 
                  padding: 20px; border-radius: 10px; display: inline-block;">
        <span style="font-size: 32px; font-weight: bold; color: #b32053; 
                     letter-spacing: 5px;">${otp}</span>
      </div>
    </div>
    <p style="color: #666; font-size: 14px;">
      This OTP will expire in 10 minutes. If you didn't request this reset, please ignore this email.
    </p>
  </div>
`;

    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Password Reset OTP",
      html: htmlContent,
    });

    console.log("Password reset OTP sent to", email, "- data:", data);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px; display:flex; justify-content:start; gap:10px; align-items:center">
      <img src="https://res.cloudinary.com/dcdynkm5d/image/upload/v1758176120/logo_png_lajh7e.png" alt="Cappadocia Logo" 
           style="max-width: 120px; margin-bottom: 10px;" />
    </div>
    <h2 style="color: #333;">Welcome! Please Verify Your Email</h2>
    <p>Thank you for signing up! Please verify your email address using the OTP code below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #f8f9fa; border: 2px dashed #28a745; 
                  padding: 20px; border-radius: 10px; display: inline-block;">
        <span style="font-size: 32px; font-weight: bold; color: #28a745; 
                     letter-spacing: 5px;">${otp}</span>
      </div>
    </div>
    <p style="color: #666; font-size: 14px;">
      This OTP will expire in 10 minutes. If you didn't create this account, please ignore this email.
    </p>
  </div>
`;

    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Verify Your Email Address",
      html: htmlContent,
    });
    console.log("Verification OTP sent to", email, "- data:", data);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
