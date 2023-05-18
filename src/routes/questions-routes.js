import express from "express";
import { check } from "express-validator";

import questionsController from "../controllers/questions-controller.js";

const router = express.Router();

router.post(
  "/create-question",
  [
    check("question").notEmpty().withMessage("Question cannot be empty."),
    check("category").notEmpty().withMessage("Category cannot be empty."),
    check("subcategory").notEmpty().withMessage("Subcategory cannot be empty."),
    check("mark")
      .notEmpty()
      .withMessage("Mark cannot be empty.")
      .custom((value) => value !== 0)
      .withMessage("Mark must be a non-zero number.")
      .custom((value) => value > 0)
      .withMessage("Mark must be greater than zero."),
    check("expectedTime")
      .notEmpty()
      .withMessage("Time cannot be empty.")
      .custom((value) => value !== 0)
      .withMessage("Time must be a non-zero number.")
      .custom((value) => value > 0)
      .withMessage("Time must be greater than zero."),
    check("createdBy")
      .notEmpty()
      .withMessage("Created by field cannot be empty."),
    check("answers").custom(async (value) => {
      if (!Array.isArray(value) || value.length < 2) {
        throw new Error(
          "Answers field must be an array with a minimum length of 2"
        );
      }
    }),
    check("correctAnswers").custom(async (value) => {
      if (!Array.isArray(value) || value.length < 1) {
        throw new Error(
          "CorrectAnswers field must be an array with a minimum length of 1"
        );
      }
    }),
  ],
  questionsController.createQuestion
);

router.get(
  "/questions/user-questions/:userID",
  questionsController.getQuestionsByUserID
);

router.get("/questions/:questionID", questionsController.getQuestionByID);

router.get("/questions", questionsController.getAllQuestions);

router.patch(
  "/update-question/:questionID",
  [
    check("question").notEmpty(),
    check("category").notEmpty(),
    check("subcategory").notEmpty(),
    check("mark").notEmpty(),
    check("expectedTime").notEmpty(),
  ],
  questionsController.updateQuestionByID
);

router.delete(
  "/delete-question/:questionID",
  questionsController.deleteQuestionByID
);

export default router;
