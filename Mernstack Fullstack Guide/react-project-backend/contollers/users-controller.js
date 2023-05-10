import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";
import User from "../models/user.js";

//---------------------------------------------------------------------------------------
async function getUsers(req, res, next) {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}
//---------------------------------------------------------------------------------------
async function signup(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorBody = errors.errors[0];
    return next(
      new HttpError(
        errorBody.msg + " in the " + errorBody.path + " field.",
        422
      )
    );
  }

  const { name, email, password } = req.body;

  let exsistingUser;
  try {
    exsistingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (exsistingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again. #hashProblem",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing Up failed, Please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing Up failed, Please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
}
//---------------------------------------------------------------------------------------
async function login(req, res, next) {
  const { email, password } = req.body;

  let exsistingUser;

  try {
    exsistingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!exsistingUser) {
    const error = new HttpError(
      "Invalid credentials, couldn't log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, exsistingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could't log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, couldn't log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: exsistingUser.id, email: exsistingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging In failed, Please try again.", 500);
    return next(error);
  }

  res.json({
    userId: exsistingUser.id,
    email: exsistingUser.email,
    token: token,
  });
}

export default { getUsers, signup, login };
