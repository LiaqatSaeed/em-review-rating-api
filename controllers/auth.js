import express from "express";
import jwt from "jsonwebtoken";
const uuid = require('uuid'); 
import bcrypt from "bcrypt";
import { User } from "../model";
import { local } from "../local";
import { JWT_SECRET_KEY } from "../middlewares";
import dotenv from "dotenv";
import { transporter } from "../helpers";
dotenv.config();

const { NO_REPLY_EMAIL } = process.env;
var router = express.Router();

export const authController = (function () {
  router.post("/register", async (req, res, next) => {
    try {
      const { password, username, name, email } = req.body;

      // Pass Hash
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        password: hashedPassword,
        username,
        name,
        email,
      });

      const result = await user.save();

      if (result) {
        res.status(201).json({ message: local.registeredSuccess });
      } else {
        res.status(500).json({ message: local.errorRegistering });
      }
    } catch (error) {
      res.status(500).send({ error, message: local.serverError });
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: local.invalidCredentials });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: local.invalidCredentials });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res.status(500).send({ error, message: local.serverError });
    }
  });

  // Endpoint to request a password reset
  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: local.userNotFound });
      }

      const resetToken = uuid.v4(); // unique token

      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // expiration 1 hour

      await user.save();

      const resetLink = `https://your-app-url/reset-password?token=${resetToken}`;

      // email data
      const mailOptions = {
        from: NO_REPLY_EMAIL,
        to: user.email,
        subject: local.passwordReset,
        text: `Click the following link to reset your password: ${resetLink}`,
      };

      // Sending email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(local.emailSendingError, error);
          res.status(500).json({ message: local.emailSendingError });
        } else {
          console.log( local.emailSent, info.response);
          res.json({ message: local.passwordResetEmailSent });
        }
      });
    } catch (error) {
      res.status(500).json({ message: local.errorProcessingReq });
    }
  });

  router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        resetToken,
        resetTokenExpires: { $gt: Date.now() } // Check if token is not expired
      });
  
      if (!user) {
        return res.status(400).json({ message: local.invalidOrExpired });
      }
  
      // Reset the user's password and remove the reset token
      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
  
      await user.save();
  
      res.json({ message: local.passResetSuccess });
    } catch (error) {
      res.status(500).json({ message: local.errorProcessingReq });
    }
  });
  

  return router;
})();
