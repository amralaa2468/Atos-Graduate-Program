import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Select from "react-select";

import "bootstrap/dist/css/bootstrap.min.css";

const CreateExamForm = () => {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["access_token", "user_ID"]);

  let token = cookies.access_token;
  let userID = cookies.user_ID;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [formErrors, setFormErrors] = useState({
    name: "",
    questions: "",
    assignedTo: "",
  });

  useEffect(() => {
    // Fetch questions and assignedTo options from APIs
    const fetchData = async () => {
      try {
        const questionsResponse = await axios.get(
          `http://localhost:5001/api/questions/questions/user-questions/${userID}`
        );
        const assignedToResponse = await axios.get(
          "http://localhost:5000/api/profile/students",
          { headers }
        );
        setQuestions(
          questionsResponse.data.questions.map((question) => ({
            value: question._id,
            label: question.question,
            selected: false,
          }))
        );
        setAssignedTo(
          assignedToResponse.data.map((student) => ({
            value: student.id,
            label: student.username,
            selected: false,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userID]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (
      !name ||
      questions.filter((question) => question.selected).length === 0 ||
      assignedTo.filter((item) => item.selected).length === 0
    ) {
      setFormErrors({
        name: name ? "" : "Exam Name is required",
        questions:
          questions.filter((question) => question.selected).length > 0
            ? ""
            : "At least one question is required",
        assignedTo:
          assignedTo.filter((item) => item.selected).length > 0
            ? ""
            : "At least one assignment is required",
      });
      return;
    }

    // Create the exam object with the form values
    const exam = {
      name,
      questions: questions
        .filter((question) => question.selected)
        .map(({ value }) => value),
      assignedTo: assignedTo
        .filter((item) => item.selected)
        .map(({ value }) => value),
      createdBy: userID,
    };

    try {
      // Send POST request to save the exam
      const response = await axios.post(
        "http://localhost:5002/api/exams/",
        exam,
        { headers }
      );

      console.log(response.data); // Response from the server
      alert("Exam definition created successfully.");
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setName("");
    setQuestions(
      questions.map((question) => ({ ...question, selected: false }))
    );
    setAssignedTo(
      assignedTo.map((student) => ({ ...student, selected: false }))
    );
    setFormErrors({
      name: "",
      questions: "",
      assignedTo: "",
    });
  };

  if (questions.length === 0) {
    return (
      <div className="m-5">
        <h2>Please create a question first.</h2>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Create Exam</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Exam Name:</label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.name ? "is-invalid" : ""
                }`}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {formErrors.name && (
                <div className="invalid-feedback">{formErrors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Questions:</label>
              <Select
                isMulti
                options={questions}
                value={questions.filter((question) => question.selected)}
                onChange={(selectedOptions) =>
                  setQuestions(
                    questions.map((question) => ({
                      ...question,
                      selected: selectedOptions.some(
                        (option) => option.value === question.value
                      ),
                    }))
                  )
                }
              />
              {formErrors.questions && (
                <div className="invalid-feedback">{formErrors.questions}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Assign To:</label>
              <Select
                isMulti
                options={assignedTo}
                value={assignedTo.filter((item) => item.selected)}
                onChange={(selectedOptions) =>
                  setAssignedTo(
                    assignedTo.map((item) => ({
                      ...item,
                      selected: selectedOptions.some(
                        (option) => option.value === item.value
                      ),
                    }))
                  )
                }
              />
              {formErrors.assignedTo && (
                <div className="invalid-feedback">{formErrors.assignedTo}</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Create Exam
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExamForm;
