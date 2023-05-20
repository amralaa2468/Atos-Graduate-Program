import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import "./navbar.css";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies([
    "access_token",
    "user_type",
    "user_ID",
  ]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    setCookies("user_type", "");
    setCookies("user_ID", "");
    navigate("/auth");
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
          {(cookies.user_type === "teacher" ||
            cookies.user_type === "admin") && (
            <li className="nav-item">
              <Link className="nav-link" to={"/questions"}>
                Questions
              </Link>
            </li>
          )}
          {cookies.user_type === "superadmin" && (
            <li className="nav-item">
              <Link className="nav-link" to={"add-admin"}>
                Add Admin
              </Link>
            </li>
          )}
        </ul>
        {!cookies.access_token ? (
          <Link className="btn btn-primary" to={"/auth"}>
            Login/Register
          </Link>
        ) : (
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};
