import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Profile } from "./user/pages/profile";
import { Questions } from "./question/pages/questions";
import { Navbar } from "./shared/components/navbar";
import { UpdateQuestion } from "./question/pages/update-question";
import { Exams } from "./exam/pages/exams";
import { StudentExam } from "./exam/pages/student-exam";
import { StudentExams } from "./exam/pages/student-exams";
import useAuth from "./user/hooks/useAuth";

import "./App.css";
import { Notifications } from "./notification/pages/notifications";

function App() {
  const [isLogin, logout] = useAuth();

  return (
    isLogin && (
      <div className="App">
        <Router>
          <Navbar logout={logout} />
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/questions/:questionID" element={<UpdateQuestion />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/student-exams" element={<StudentExams />} />
            <Route
              path="/student-exam/:examInstanceID"
              element={<StudentExam />}
            />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Router>
      </div>
    )
  );
}

export default App;
