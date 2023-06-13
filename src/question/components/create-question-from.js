import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateQuestionForm = () => {
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

  let token = cookies.access_token;
  let userID = cookies.user_ID;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [errors, setErrors] = useState({});

  const handleAddAnswer = () => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { answer: newAnswer, description: newAnswerDescription },
    ]);
    setNewAnswer("");
    setNewAnswerDescription("");
  };

  const handleToggleCorrectAnswer = (correctAnswerIndex) => {
    const updatedCorrectAnswers = [...correctAnswers];
    if (updatedCorrectAnswers.includes(correctAnswerIndex)) {
      updatedCorrectAnswers.splice(
        updatedCorrectAnswers.indexOf(correctAnswerIndex),
        1
      );
    } else {
      updatedCorrectAnswers.push(correctAnswerIndex);
    }
    setCorrectAnswers(updatedCorrectAnswers);
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

    const updatedQuestionModel = {
      question,
      category,
      subcategory,
      mark,
      createdBy: userID,
      expectedTime,
      answers,
      correctAnswers: correctAnswers.map((index) => answers[index]),
    };

    try {
      await axios.post(
        "http://localhost:5001/api/questions/create-question",
        updatedQuestionModel,
        { headers }
      );
      alert("Question created successfully");
      resetForm();
    } catch (error) {
      alert(
        "There is a problem with creating the question. Please try again later."
      );
      console.log(error);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setCategory("");
    setSubcategory("");
    setMark(0);
    setExpectedTime(0);
    setAnswers([]);
    setNewAnswer("");
    setNewAnswerDescription("");
    setCorrectAnswers([]);
    setErrors({});
  };

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Create Question</h2>
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
                <div key={index} className="mb-3">
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
                  <label>
                    <input
                      type="checkbox"
                      checked={correctAnswers.includes(index)}
                      onChange={() => handleToggleCorrectAnswer(index)}
                    />{" "}
                    Correct Answer
                  </label>
                </div>
              ))}
              {answers.length < 2 && (
                <p className="text-danger">At least 2 answers are required.</p>
              )}
              {correctAnswers.length === 0 && (
                <p className="text-danger">
                  At least 1 correct answer is required.
                </p>
              )}
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
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionForm;
