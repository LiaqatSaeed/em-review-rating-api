import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../model";
import { local } from "../local";
import { JWT_SECRET_KEY } from "../middlewares";
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

      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ token });

    } catch (error) {
      res.status(500).send({ error, message: local.serverError });
    }
  });
  return router;
})();
