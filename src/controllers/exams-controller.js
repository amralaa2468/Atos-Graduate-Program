import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import util from "util";

import HttpError from "../models/http-error.js";
import pool from "../../database.js";
import examsQueries from "../queries/exams-queries.js";

const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_KEY}\n-----END PUBLIC KEY-----`;

function createExamDefinition(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const headerToken = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(headerToken, publicKey, {
    algorithms: ["RS256"],
  });
  const userType = decodedToken.userType;

  if (userType !== "teacher") {
    const error = new HttpError(
      "Only teachers can create a exam definitions.",
      402
    );
    return next(error);
  }

  const { name, questions, assignedTo, createdBy } = req.body;

  pool.query(
    examsQueries.createExamDefinition,
    [name, questions, assignedTo, createdBy],
    (error, results) => {
      if (error) {
        const err = new HttpError(
          "Something went wrong, cannot create exam definition.",
          402
        );
        return next(err);
      }

      res.status(201).send("Exam definition created successfully.");
    }
  );
}
//----------------------------------------------------------------------------
function getTeacherExamsDefinition(req, res, next) {
  const teacherID = req.params.teacherID;

  pool.query(
    examsQueries.getTeacherExamsDefinition,
    [teacherID],
    (error, results) => {
      if (error) {
        const err = new HttpError(
          "Something went wrong, cannot get exams definition.",
          402
        );
        return next(err);
      }

      res.status(200).json(results.rows);
    }
  );
}
//----------------------------------------------------------------------------
function getQuestionsFromExamDefinition(req, res, next) {
  const examInstanceID = parseInt(req.params.examInstanceID);

  pool.query(
    examsQueries.getQuestionsFromExamDefinition,
    [examInstanceID],
    (error, results) => {
      if (error) {
        console.log(error);
        const err = new HttpError(
          "Something went wrong, cannot get questions from exam definition.",
          402
        );
        return next(err);
      }

      res.status(200).json(results.rows);
    }
  );
}
//----------------------------------------------------------------------------
async function getAssignedToFromExamDefinition(examDefinitionID) {
  const queryAsync = util.promisify(pool.query).bind(pool);

  try {
    const results = await queryAsync(
      examsQueries.getAssignedToFromExamDefinition,
      [examDefinitionID]
    );

    return results.rows[0].assignedto;
  } catch (error) {
    console.error(error);
    throw new HttpError(
      "Something went wrong, cannot get assigned to from exams definition",
      402
    );
  }
}
//----------------------------------------------------------------------------
async function createExamInstance(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, publicKey, {
    algorithms: ["RS256"],
  });
  const userType = decodedToken.userType;

  if (userType !== "teacher") {
    const error = new HttpError(
      "Only teachers can create an exam instance.",
      402
    );
    return next(error);
  }

  const { examDefinitionID, duration, createdBy, generatedLink } = req.body;

  const assignedTo = await getAssignedToFromExamDefinition(examDefinitionID);

  assignedTo.forEach((assignedUser) => {
    pool.query(
      examsQueries.createExamInstance,
      [examDefinitionID, duration, createdBy, generatedLink, assignedUser],
      (error, results) => {
        if (error) {
          console.log(error);
          const err = new HttpError(
            "Something went wrong, cannot create exam instance.",
            402
          );
          return next(err);
        }
      }
    );
  });

  res.status(201).send("Exam instances created successfully.");
}

//----------------------------------------------------------------------------
function getStudentExams(req, res, next) {
  const studentID = req.params.studentID;
  const currentTime = new Date().toISOString();

  pool.query(
    examsQueries.getStudentExams,
    [studentID, currentTime],
    (error, results) => {
      if (error) {
        console.log(error);
        const err = new HttpError(
          "Something went wrong, cannot get student exams.",
          402
        );
        return next(err);
      }

      res.status(200).json(results.rows);
    }
  );
}
//----------------------------------------------------------------------------
function submitExam(req, res, next) {
  const examInstanceID = req.params.examInstanceID;
  const { startTime, endTime, takenBy, status, questions, grade, passed } =
    req.body;

  pool.query(
    examsQueries.submitExam,
    [
      startTime,
      endTime,
      takenBy,
      status,
      questions,
      examInstanceID,
      grade,
      passed,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        const err = new HttpError(
          "Something went wrong, cannot submit examd.",
          402
        );
        return next(err);
      }

      res.json("Exam submitted successfully.");
    }
  );
}
//----------------------------------------------------------------------------
export default {
  createExamDefinition,
  getTeacherExamsDefinition,
  createExamInstance,
  getStudentExams,
  getQuestionsFromExamDefinition,
  submitExam,
  getAssignedToFromExamDefinition,
};
