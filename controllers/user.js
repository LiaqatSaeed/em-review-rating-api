import express from "express";
import { local } from "../local";
import { User } from "../model";
import { authError, authenticateToken } from "../middlewares";
var router = express.Router();

export const userController = (function () {
  router.get("/", authenticateToken, async (req, res, next) => {
    try {
      const users = await User.find({}, "_id username email name");

      res.json(users);
    } catch (error) {
      res.status(500).send({ error, message: local.serverError });
    }
  });

  return router;
})();
