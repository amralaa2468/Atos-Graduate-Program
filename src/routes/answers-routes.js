import express from "express";
import { check } from "express-validator";

import answersController from "../controllers/answers-controller.js";

const router = express.Router();

router.post(
  "/add-answer",
  [check("answer").notEmpty().withMessage("Answer can't be empty.")],
  answersController.addAnswerToExistingQuestion
);

router.delete(
  "/delete-answer/:questionID&:answerID",
  answersController.deleteAnswerFromExistingQuestion
);

export default router;
