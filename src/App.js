import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth } from "./user/pages/auth";
import { Profile } from "./user/pages/profile";
import { Questions } from "./question/pages/questions";
import { Navbar } from "./shared/components/navbar";
import { AddAdmin } from "./user/pages/add-admin";
import { UpdateQuestion } from "./question/pages/update-question";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:questionID" element={<UpdateQuestion />} />
          <Route path="/add-admin" element={<AddAdmin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
