import express from "express";
import { check } from "express-validator";

import usersController from "../controllers/users-controller.js";

const router = express.Router();

router.post(
  "/signup",
  [
    check("username").notEmpty().withMessage("Username cannot be empty."),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
  ],
  usersController.signup
);

router.post(
  "/login",
  [
    check("username").notEmpty().withMessage("Username cannot be empty."),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long."),
  ],
  usersController.login
);

router.get("/user/", usersController.getUserById);

export default router;
