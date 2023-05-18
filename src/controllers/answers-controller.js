import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import { Answer } from "../models/answer.js";
import Question from "../models/question.js";

async function addAnswerToExistingQuestion(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res.status(400).json({ errors: errorMessages });
  }

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);

  const userID = decodedToken.userID;
  const questionID = req.body.questionID;

  const newAnswer = new Answer(req.body);

  let question;
  try {
    question = await Question.findById(questionID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Couldn't find a question.",
      500
    );
    return next(error);
  }

  if (!question) {
    const error = new HttpError(
      "Could't find a question for the provided question ID.",
      404
    );
    return next(error);
  }

  if (question.createdBy !== userID) {
    const error = new HttpError(
      "Only the teacher that created the question can update it.",
      401
    );
    return next(error);
  }

  question.answers.push(newAnswer);

  try {
    await question.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  try {
    const response = await newAnswer.save();
    res.json(response);
  } catch (err) {
    const error = new HttpError(
      "Adding an answer failed please try again.",
      500
    );
    return next(error);
  }
}
//---------------------------------------------------------------
async function deleteAnswerFromExistingQuestion(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_KEY);

  const userID = decodedToken.userID;
  const questionID = req.params.questionID;
  const answerID = req.params.answerID;

  let question;
  try {
    question = await Question.findById(questionID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not get question with provided ID.",
      500
    );
    return next(error);
  }

  if (question.createdBy !== userID) {
    const error = new HttpError(
      "Only the teacher that created the question can delete the answer.",
      401
    );
    return next(error);
  }

  let answer;
  try {
    answer = await Answer.findById(answerID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not get answer with provided ID.",
      500
    );
    return next(error);
  }

  try {
    await answer.deleteOne();
    question.answers.pull(answer);
    question.correctAnswers.pull(answer);
    await question.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete answer.",
      500
    );
    return next(error);
  }

  res.json({ message: "Deleted answer successfully." });
}
//---------------------------------------------------------------

export default {
  addAnswerToExistingQuestion,
  deleteAnswerFromExistingQuestion,
};
