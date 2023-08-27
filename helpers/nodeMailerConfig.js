import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { SMTP_USER_EMAIL, SMTP_USER_PASSWORD } = process.env;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USER_EMAIL,
    pass: SMTP_USER_PASSWORD,
  },
});
