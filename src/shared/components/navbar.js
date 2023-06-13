import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import useAuth from "../../user/hooks/useAuth";
import Keycloak from "keycloak-js";

import "./navbar.css";

export const Navbar = ({ logout }) => {
  //const [isLogin, token, logout] = useAuth();
  const [cookies, setCookies] = useCookies([
    "access_token",
    "user_type",
    "user_ID",
  ]);

  const handleLogout = () => {
    // let user_ID = cookies.user_ID;
    // setCookies("access_token", "");
    // setCookies("user_type", "");
    // setCookies("user_ID", "");

    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg px-3">
      <span className="navbar-brand">Question Bank</span>
      <div className="navbar-collapse justify-content-between">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={"/"}>
              Profile
            </Link>
          </li>
          {cookies.user_type === "teacher" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to={"/questions"}>
                  Questions
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/exams"}>
                  Exams
                </Link>
              </li>
            </>
          )}
          {cookies.user_type === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" to={"/questions"}>
                Questions
              </Link>
            </li>
          )}
          {cookies.user_type === "student" && (
            <li className="nav-item">
              <Link className="nav-link" to={"/student-exams"}>
                Exams
              </Link>
            </li>
          )}
        </ul>
        {cookies.access_token && (
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};
