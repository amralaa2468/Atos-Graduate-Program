import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

import "bootstrap/dist/css/bootstrap.min.css";

const StudentExamsList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["access_token", "user_ID"]);

  const studentID = cookies.user_ID;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/exams/exams/${studentID}`
        );
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExams();
  }, [studentID]);

  const filteredExams = exams.filter((exam) => !exam.status);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h2>Exams List</h2>
      {filteredExams.length === 0 ? (
        <p>No available exams</p>
      ) : (
        filteredExams.map((exam) => (
          <div className="card mb-3" key={exam.examinstanceid}>
            <div className="card-body">
              <h5 className="card-title">{exam.name}</h5>
              <Link to={`/student-exam/${exam.examinstanceid}`}>
                <button className="btn btn-primary">Take Exam</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentExamsList;
