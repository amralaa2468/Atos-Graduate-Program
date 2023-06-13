import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import Question from "../models/question.js";
import { Answer } from "../models/answer.js";

const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_KEY}\n-----END PUBLIC KEY-----`;

async function createQuestion(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res.status(400).json({ errors: errorMessages });
  }

  const { question, category, subcategory, mark, expectedTime, createdBy } =
    req.body;

  const answersIDArray = [];
  const correctAnswersIDArray = [];
  const answers = req.body.answers;
  const correctAnswers = req.body.correctAnswers;

  //promise.all handles an array of promises
  await Promise.all(
    answers.map(async (answer) => {
      const correctAnswerExists = correctAnswers.some(
        (correctAnswer) => correctAnswer.answer === answer.answer
      );
      //.some checks if any element in the correctAnswers array satisfies the provided condition.
      if (correctAnswerExists) {
        const answerToAdd = new Answer(answer);
        let response = await answerToAdd.save();
        answersIDArray.push(response._id);
        correctAnswersIDArray.push(response._id);
      } else {
        const answerToAdd = new Answer(answer);
        let response = await answerToAdd.save();
        answersIDArray.push(response._id);
      }
    })
  );

  const newQuestion = new Question({
    question,
    category,
    subcategory,
    mark,
    expectedTime,
    createdBy,
    answers: answersIDArray,
    correctAnswers: correctAnswersIDArray,
  });

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
  const userType = decodedToken.userType;

  if (userType !== "teacher") {
    const error = new HttpError("Only teachers can create a question.", 402);
    return next(error);
  }

  try {
    const response = await newQuestion.save();
    res.json(response);
  } catch (err) {
    const error = new HttpError(
      "Creating question failed please try again.",
      500
    );
    return next(error);
  }
}
//-------------------------------------------------------------
async function getQuestionsByUserID(req, res, next) {
  const userID = req.params.userID;

  let questions;
  try {
    questions = await Question.find({ createdBy: userID })
      .populate("correctAnswers")
      .populate("answers");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Couldn't find a question.",
      500
    );
    return next(error);
  }

  if (!questions || questions.length === 0) {
    const error = new HttpError(
      "Could't find question(s) for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({ questions: questions });
}
//----------------------------------------------------------
async function getQuestionByID(req, res, next) {
  const questionID = req.params.questionID;

  let question;
  try {
    question = await Question.findById(questionID)
      .populate("correctAnswers")
      .populate("answers");
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

  res.json({ question: question });
}
//----------------------------------------------------------
async function getAllQuestions(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
  let userType = decodedToken.userType;

  if (userType === "student") {
    const error = new HttpError("Students cannot access questions.", 402);
    return next(error);
  }

  let filter = {};

  // Check if a category filter is provided in the request query
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let totalQuestions;
  let questions;
  try {
    totalQuestions = await Question.countDocuments(filter);
    questions = await Question.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("answers")
      .populate("correctAnswers");
  } catch (err) {
    const error = new HttpError(
      "Fetching questions failed, please try again later.",
      500
    );
    return next(error);
  }

  const totalPages = Math.ceil(totalQuestions / limit);

  res.json({ questions: questions, totalPages: totalPages });
}

//----------------------------------------------------------------
async function updateQuestionByID(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);

    return res.status(400).json({ errors: errorMessages });
  }

  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });

  const userID = decodedToken.sub;
  const userType = decodedToken.userType;

  const questionToUpdate = new Question(req.body);
  const questionID = req.params.questionID;

  if (userType !== "teacher") {
    const error = new HttpError(
      "Teacher only is allowed to update questions.",
      402
    );
    return next(error);
  }

  let question;
  try {
    question = await Question.findById(questionID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find question with the questionID.",
      500
    );
    return next(error);
  }

  if (questionToUpdate.createdBy !== userID) {
    const error = new HttpError(
      "Only the teacher that created the question can update it.",
      401
    );
    return next(error);
  }

  question.question = questionToUpdate.question;
  question.category = questionToUpdate.category;
  question.subcategory = questionToUpdate.subcategory;
  question.mark = questionToUpdate.mark;
  question.expectedTime = questionToUpdate.expectedTime;
  question.correctAnswers = questionToUpdate.correctAnswers;
  question.answers = questionToUpdate.answers;

  try {
    await question.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not update question.",
      500
    );
    return next(error);
  }

  res.json({ question: question });
}
//---------------------------------------------------------------
async function deleteQuestionByID(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
  const userType = decodedToken.userType;
  const questionID = req.params.questionID;

  if (userType !== "admin") {
    const error = new HttpError(
      "Admin only is allowed to delete questions.",
      402
    );
    return next(error);
  }

  let question;
  try {
    question = await Question.findById(questionID).populate("answers");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete question ID.",
      500
    );
    return next(error);
  }

  if (!question) {
    const error = new HttpError(
      "Could not find a question with the provided question id.",
      404
    );
    return next(error);
  }

  try {
    // Delete all associated answers
    await Answer.deleteMany({ _id: { $in: question.answers } });

    // Delete the question
    await Question.deleteOne({ _id: questionID });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete question.",
      500
    );
    return next(error);
  }

  res.json({ message: "Deleted question successfully." });
}
//-------------------------------------------------------------------

export default {
  createQuestion,
  getQuestionsByUserID,
  getQuestionByID,
  getAllQuestions,
  updateQuestionByID,
  deleteQuestionByID,
};
