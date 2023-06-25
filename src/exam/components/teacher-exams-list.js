import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(60);
  const [scheduledTimeFrom, setScheduledTimeFrom] = useState("");
  const [scheduledTimeTo, setScheduledTimeTo] = useState("");
  const [cookies] = useCookies(["access_token", "user_ID"]);

  const token = cookies.access_token;
  const teacherID = cookies.user_ID;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/exams/${teacherID}`
        );
        setExams(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExams();
  }, [teacherID]);

  const handlePublishExam = async (examID) => {
    if (!scheduledTimeFrom || !scheduledTimeTo) {
      alert("Please enter scheduled time details.");
      return;
    }

    const exam = {
      examDefinitionID: examID,
      duration,
      createdBy: teacherID,
      generatedLink: {
        token,
        url: "http://localhost:3000/student-exams",
        scheduledTimeFrom,
        scheduledTimeTo,
        notification: "You have been assigned an exam.",
      },
    };

    try {
      await axios.post("http://localhost:5002/api/exams/exam", exam, {
        headers,
      });
      alert("Exam published successfully");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h2 className="mt-4">Exams</h2>
      {exams.length === 0 ? (
        <p>You did not create any exams. Please create one.</p>
      ) : (
        exams.map((exam) => (
          <div className="card mb-3" key={exam.id}>
            <div className="card-body">
              <h5 className="card-title">{exam.name}</h5>
              <div className="mb-3">
                <label className="form-label">Duration (minutes):</label>
                <input
                  type="number"
                  className="form-control"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Scheduled Time From:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduledTimeFrom}
                  onChange={(event) => setScheduledTimeFrom(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Scheduled Time To:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduledTimeTo}
                  onChange={(event) => setScheduledTimeTo(event.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handlePublishExam(exam.id)}
              >
                Publish Exam
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExamList;
