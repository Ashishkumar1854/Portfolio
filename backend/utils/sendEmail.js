import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: 'Ashish Portfolio <noreply@ashishportfolio.aigateway.in>',
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
