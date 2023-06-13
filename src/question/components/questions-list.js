import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [cookies] = useCookies(["user_ID", "access_token", "user_type"]);

  let userID = cookies.user_ID;
  let user_type = cookies.user_type;
  let token = cookies.access_token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (user_type === "admin") {
        try {
          const response = await axios.get(
            "http://localhost:5001/api/questions/questions",
            { headers }
          );
          setQuestions(response.data.questions);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/questions/questions/user-questions/${userID}`
          );
          setQuestions(response.data.questions);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchQuestions();
  }, [questions, headers, userID, user_type]);

  const handleDeleteQuestion = async (questionID) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/questions/delete-question/${questionID}`,
        { headers }
      );
      alert("Question deleted successfully");
      // Refresh the question list
      if (user_type === "admin") {
        const response = await axios.get(
          "http://localhost:5001/api/questions/questions",
          { headers }
        );
        setQuestions(response.data.questions);
      } else {
        const response = await axios.get(
          `http://localhost:5001/api/questions/questions/user-questions/${userID}`
        );
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete the question");
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Questions</h2>
      {questions.length === 0 ? (
        <p>You did not create any questions. Please create one.</p>
      ) : (
        questions.map((question) => (
          <div key={question._id} className="card mt-4">
            <div className="card-body">
              <h4>{question.question}</h4>
              <p>
                <strong>Category:</strong> {question.category}
              </p>
              <p>
                <strong>Subcategory:</strong> {question.subcategory}
              </p>
              <p>
                <strong>Mark:</strong> {question.mark}
              </p>
              <p>
                <strong>Expected Time:</strong> {question.expectedTime}
              </p>
              <p>
                <strong>Correct Answers:</strong>{" "}
                {question.correctAnswers
                  .map((answer) => answer.answer)
                  .join(", ")}
              </p>
              <p>
                <strong>Created By:</strong> {question.createdBy}
              </p>
              <ul>
                {question.answers.map((answer) => (
                  <li key={answer._id}>
                    <strong>Answer:</strong> {answer.answer}
                    <br />
                    <strong>Description:</strong> {answer.description || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
            <div className="d-flex justify-content-center my-3">
              <div className="button-container d-flex flex-column align-items-center">
                {user_type === "teacher" && (
                  <Link
                    to={`/questions/${question._id}`}
                    className="card mt-4 px-5"
                  >
                    <div className="card-body">EDIT</div>
                  </Link>
                )}
                {user_type === "admin" && (
                  <button
                    className="btn btn-danger my-3"
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    DELETE
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionsList;
