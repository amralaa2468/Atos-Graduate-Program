import express from "express";
import { check } from "express-validator";

import examsController from "../controllers/exams-controller.js";

const router = express.Router();

router.get("/:teacherID", examsController.getTeacherExamsDefinition);

router.get("/exams/:studentID", examsController.getStudentExams);

router.get(
  "/exam/questions/:examInstanceID",
  examsController.getQuestionsFromExamDefinition
);

router.get("/assigned-to", examsController.getAssignedToFromExamDefinition);

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name field is required"),
    check("questions").notEmpty().withMessage("Questions field is required"),
    check("assignedTo").notEmpty().withMessage("AssignedTo field is required"),
  ],
  examsController.createExamDefinition
);

router.post("/exam", examsController.createExamInstance);

router.patch("/exam/:examInstanceID", examsController.submitExam);

export default router;
