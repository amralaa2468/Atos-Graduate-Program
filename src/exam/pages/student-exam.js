import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export const StudentExam = () => {
  const { examInstanceID } = useParams();

  const [questionIDs, setQuestionIDs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayTime, setDisplayTime] = useState("");
  const [marks, setMarks] = useState([]);
  const [studentGrade, setStudentGrade] = useState(0);
  const [pass, setPass] = useState(false);
  const [examDuration, setExamDuration] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const [cookies] = useCookies(["access_token", "user_ID"]);

  const studentID = cookies.user_ID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/exams/exam/questions/${examInstanceID}`
        );
        const data = response.data;
        const questions = data[0].questions;
        setExamDuration(data[0].duration);
        setQuestionIDs(questions);

        const fetchQuestions = async () => {
          try {
            const questionPromises = questions.map((questionID) =>
              axios.get(
                `http://localhost:5001/api/questions/questions/${questionID}`
              )
            );
            const questionResponses = await Promise.all(questionPromises);
            const fetchedQuestions = questionResponses.map(
              (response) => response.data.question
            );
            setQuestions(fetchedQuestions);

            const updatedQuestions = fetchedQuestions.map((question) => {
              const correctAnswer = question.correctAnswers[0]._id;
              const mark = question.mark;
              return { ...question, correctAnswer, mark };
            });

            setQuestions(updatedQuestions);

            const marks = updatedQuestions.map((question) => question.mark);
            setMarks(marks);
          } catch (error) {
            console.error(error);
          }
        };

        fetchQuestions();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [examInstanceID]);

  const handleAnswerSelect = (selectedAnswerID) => {
    const newAnswerTime = new Date().toISOString();
    const answerExists = answers.some(
      (answer) => answer.questionID === questionIDs[currentIndex]
    );

    if (answerExists) {
      setAnswers((prevAnswers) =>
        prevAnswers.filter(
          (answer) => answer.questionID !== questionIDs[currentIndex]
        )
      );
    } else {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          questionID: questionIDs[currentIndex],
          selectedAnswerID,
          answerTime: newAnswerTime,
          displayTime,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    const answerExists = answers.some(
      (answer) => answer.questionID === questionIDs[currentIndex]
    );

    if (!answerExists) {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (currentIndex < questionIDs.length - 1) {
      setDisplayTime(new Date().toISOString());
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true);
      const patchData = {
        startTime,
        endTime: new Date().toISOString(),
        takenBy: studentID,
        status: true,
        questions: answers,
        grade: studentGrade,
        passed: pass,
      };

      const startTimeMs = new Date(patchData.startTime).getTime();
      const endTimeMs = new Date(patchData.endTime).getTime();
      const durationMs = endTimeMs - startTimeMs;
      const durationMinutes = durationMs / (1000 * 60); // Convert duration to minutes

      if (durationMinutes > examDuration) {
        patchData.passed = false;
      }

      await axios.patch(
        `http://localhost:5002/api/exams/exam/${examInstanceID}`,
        patchData
      );

      console.log("Exam submitted successfully!");
      alert("Exam submitted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setStartTime(new Date().toISOString());
    setDisplayTime(new Date().toISOString());

    if (examDuration > 0) {
      setCountdown(examDuration * 60);
    }
  }, [examDuration]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (currentIndex === questionIDs.length - 1) {
      const grade = answers.reduce((totalGrade, answer) => {
        const question = questions.find((q) => q._id === answer.questionID);
        if (question && answer.selectedAnswerID === question.correctAnswer) {
          return totalGrade + question.mark;
        }
        return totalGrade;
      }, 0);
      setStudentGrade(grade);

      const totalMarks = marks.reduce((total, mark) => total + mark, 0);
      const passStatus = grade >= totalMarks / 2;
      setPass(passStatus);
    }
  }, [answers, currentIndex, questionIDs, questions, marks]);

  if (questionIDs.length === 0 || questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswerID = answers.find(
    (answer) => answer.questionID === questionIDs[currentIndex]
  )?.selectedAnswerID;

  const formattedMinutes = Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0");
  const formattedSeconds = (countdown % 60).toString().padStart(2, "0");

  return (
    <div className="container">
      <h1>Exam</h1>
      <h2>Questions:</h2>
      <div className="card">
        <div className="card-body">
          <h3>Question {currentIndex + 1}</h3>
          <p>{currentQuestion.question}</p>
          <ul className="list-group">
            {currentQuestion.answers.map((answer) => (
              <li
                key={answer._id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  selectedAnswerID === answer._id ? "selected-answer" : ""
                }`}
              >
                {answer.answer}
                <span className="badge bg-primary rounded-pill">
                  {answer.description}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnswerSelect(answer._id)}
                  disabled={isSubmitting}
                >
                  {selectedAnswerID === answer._id
                    ? "Selected"
                    : "Select Answer"}
                </button>
              </li>
            ))}
          </ul>
          {currentIndex < questionIDs.length - 1 && (
            <button
              className="btn btn-primary mt-3"
              onClick={handleNextQuestion}
              disabled={isSubmitting}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
      {currentIndex === questionIDs.length - 1 && (
        <div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmitExam}
            disabled={isSubmitting}
          >
            Submit Exam
          </button>
        </div>
      )}
      <div className="card countdown-card position-fixed top-5 end-5 mt-3">
        <div className="card-body">
          <h3>Time Remaining:</h3>
          <p>
            {formattedMinutes}:{formattedSeconds}
          </p>
        </div>
      </div>
    </div>
  );
};
