import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";
import User from "../models/user.js";

async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res.status(400).json({ errors: errorMessages });
  }

  const { username, password, userType } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, Please login instead.",
      422
    );
    return next(error);
  }

  if (userType === "superadmin") {
    const error = new HttpError(
      "Can not create a superadmin, Please choose another user type.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, Please try again. #hashProblem",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    userType,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing Up failed, Can not save user, Please try again.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userID: createdUser.id, username, userType },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing Up failed, Please try again.", 500);
    return next(error);
  }

  res.json({
    message: "Signed Up successfully please login.",
    userType,
    userID: createdUser.id,
    token,
  });
}
//-------------------------------------------------------------------------
async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res.status(400).json({ errors: errorMessages });
  }

  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, couldn not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could't log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userID: existingUser.id,
        username: existingUser.username,
        userType: existingUser.userType,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging In failed, Please try again.", 500);
    return next(error);
  }

  res.json({
    message: "Logged in successfully.",
    userType: existingUser.userType,
    userID: existingUser.id,
    token: token,
  });
}
//-------------------------------------------------------------------------
async function getUserById(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  let decodedToken = jwt.verify(token, process.env.JWT_KEY);

  let userID = decodedToken.userID;

  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({
    user: user,
  });
}

export default { signup, login, getUserById };
