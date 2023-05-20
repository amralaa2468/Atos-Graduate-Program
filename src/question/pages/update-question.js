import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

export const UpdateQuestion = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [mark, setMark] = useState(0);
  const [expectedTime, setExpectedTime] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [newAnswerDescription, setNewAnswerDescription] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [cookies] = useCookies(["access_token", "user_ID"]);
  const questionID = useParams().questionID;

  const navigate = useNavigate();

  let token = cookies.access_token;
  let userID = cookies.user_ID;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/questions/questions/${questionID}`
        );
        const {
          question,
          category,
          subcategory,
          mark,
          expectedTime,
          answers,
          correctAnswers,
        } = response.data.question;
        setQuestion(question);
        setCategory(category);
        setSubcategory(subcategory);
        setMark(mark);
        setExpectedTime(expectedTime);
        setAnswers(answers);

        const selectedCorrectAnswers = correctAnswers.map((answer) =>
          answers.findIndex((ans) => ans._id === answer._id)
        );
        setCorrectAnswers(selectedCorrectAnswers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestion();
  }, [questionID]);

  const handleAddAnswer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/answers/add-answer",
        {
          questionID: questionID,
          answer: newAnswer,
          description: newAnswerDescription,
        },
        { headers }
      );

      // Assuming the response contains the newly added answer object
      const newAnswerObject = response.data;

      setAnswers((prevAnswers) => [...prevAnswers, newAnswerObject]);
      setNewAnswer("");
      setNewAnswerDescription("");
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  const handleToggleCorrectAnswer = (answerIndex) => {
    if (correctAnswers.includes(answerIndex)) {
      // Remove from correctAnswers
      const updatedCorrectAnswers = correctAnswers.filter(
        (index) => index !== answerIndex
      );
      setCorrectAnswers(updatedCorrectAnswers);
    } else {
      // Add to correctAnswers
      const updatedCorrectAnswers = [...correctAnswers, answerIndex];
      setCorrectAnswers(updatedCorrectAnswers);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/answers/delete-answer/${questionID}&${answerId}`,
        { headers }
      );

      // Assuming the answer is deleted successfully
      // Refresh the answers list
      const response = await axios.get(
        `http://localhost:5001/api/questions/questions/${questionID}`,
        { headers }
      );
      const { answers } = response.data.question;
      setAnswers(answers);

      // Check if the deleted answer was a correct answer
      const updatedCorrectAnswers = correctAnswers.filter(
        (index) => answers[index] && answers[index]._id !== answerId
      );
      setCorrectAnswers(updatedCorrectAnswers);
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    const errors = {};

    if (!question) {
      errors.question = "Question is required.";
    }

    if (!category) {
      errors.category = "Category is required.";
    }

    if (!subcategory) {
      errors.subcategory = "Subcategory is required.";
    }

    if (mark === 0) {
      errors.mark = "Mark should be greater than 0.";
    }

    if (expectedTime === 0) {
      errors.expectedTime = "Expected Time should be greater than 0.";
    }

    if (answers.length < 2) {
      errors.answers = "At least 2 answers are required.";
    }

    if (correctAnswers.length === 0) {
      errors.correctAnswers = "At least 1 correct answer is required.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const updatedCorrectAnswers = correctAnswers;

    const updatedQuestionData = {
      question,
      category,
      subcategory,
      mark,
      expectedTime,
      correctAnswers: updatedCorrectAnswers.map((index) => answers[index]),
      createdBy: userID,
      answers,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/questions/update-question/${questionID}`,
        updatedQuestionData,
        { headers }
      );
      alert("Question updated successfully");
      navigate("/questions");
    } catch (error) {
      alert(
        "There was an error updating the question. Please try again later."
      );
      console.error(error);
    }
  };

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Edit Question</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Question:</label>
              <input
                type="text"
                className={`form-control ${errors.question && "is-invalid"}`}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Enter the question"
              />
              {errors.question && (
                <div className="invalid-feedback">{errors.question}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Category:</label>
              <input
                type="text"
                className={`form-control ${errors.category && "is-invalid"}`}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Enter the category"
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Subcategory:</label>
              <input
                type="text"
                className={`form-control ${errors.subcategory && "is-invalid"}`}
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
                placeholder="Enter the subcategory"
              />
              {errors.subcategory && (
                <div className="invalid-feedback">{errors.subcategory}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Mark:</label>
              <input
                type="number"
                className={`form-control ${errors.mark && "is-invalid"}`}
                value={mark}
                onChange={(event) => setMark(Number(event.target.value))}
                placeholder="Enter the mark"
              />
              {errors.mark && (
                <div className="invalid-feedback">{errors.mark}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Expected Time:</label>
              <input
                type="number"
                className={`form-control ${
                  errors.expectedTime && "is-invalid"
                }`}
                value={expectedTime}
                onChange={(event) =>
                  setExpectedTime(Number(event.target.value))
                }
                placeholder="Enter the expected time"
              />
              {errors.expectedTime && (
                <div className="invalid-feedback">{errors.expectedTime}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Answers:</label>
              {answers.map((answer, index) => (
                <div key={answer._id} className="card mb-3">
                  <div className="card-body">
                    <input
                      type="text"
                      className="form-control"
                      value={answer.answer}
                      onChange={(event) => {
                        const updatedAnswers = [...answers];
                        updatedAnswers[index].answer = event.target.value;
                        setAnswers(updatedAnswers);
                      }}
                      placeholder={`Enter answer ${index + 1}`}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={answer.description}
                      onChange={(event) => {
                        const updatedAnswers = [...answers];
                        updatedAnswers[index].description = event.target.value;
                        setAnswers(updatedAnswers);
                      }}
                      placeholder={`Enter description for answer ${index + 1}`}
                    />
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={correctAnswers.includes(index)}
                        onChange={() => handleToggleCorrectAnswer(index)}
                      />
                      <span className="ms-2">Correct Answer</span>
                      <button
                        type="button"
                        className="btn btn-danger ms-auto my-1"
                        onClick={() => handleDeleteAnswer(answer._id)}
                      >
                        Delete Answer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={newAnswer}
                  onChange={(event) => setNewAnswer(event.target.value)}
                  placeholder="Enter a new answer"
                />
                <input
                  type="text"
                  className="form-control mt-1"
                  value={newAnswerDescription}
                  onChange={(event) =>
                    setNewAnswerDescription(event.target.value)
                  }
                  placeholder="Enter a description for the new answer"
                />
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={handleAddAnswer}
                >
                  Add Answer
                </button>
                {errors.answers && (
                  <div className="invalid-feedback">{errors.answers}</div>
                )}
                {errors.correctAnswers && (
                  <div className="invalid-feedback">
                    {errors.correctAnswers}
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Update Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
