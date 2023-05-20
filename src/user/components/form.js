import React, { useState } from "react";

export const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  userType,
  setUserType,
  label,
  creator,
  onSubmit,
}) => {
  const [errors, setErrors] = useState({});
  const options = ["student", "teacher"];

  const validateForm = () => {
    const errors = {};

    // Validate username
    if (!username) {
      errors.username = "Username is required.";
    } else if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long.";
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 5) {
      errors.password = "Password must be at least 5 characters long.";
    }

    // Validate user type
    if (label === "Register" && !userType) {
      errors.userType = "User type is required.";
    }

    setErrors(errors);

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(event);
    }
  };

  return (
    <div className="auth-container mx-5 my-3">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{label}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                }`}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setErrors({ ...errors, username: "" }); // Clear error when user types
                }}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors({ ...errors, password: "" }); // Clear error when user types
                }}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            {label === "Register" && (
              <div className="mb-3">
                <label htmlFor="user-type" className="form-label">
                  User type:
                </label>
                {creator.creator === "superadmin" ? (
                  <select
                    className={`form-control ${
                      errors.userType ? "is-invalid" : ""
                    }`}
                    onChange={() => setUserType("admin")}
                  >
                    <option value="usertypes">Select a type</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  <select
                    className={`form-control ${
                      errors.userType ? "is-invalid" : ""
                    }`}
                    name="user-type"
                    value={userType}
                    onChange={(event) => {
                      setUserType(event.target.value);
                      setErrors({ ...errors, userType: "" }); // Clear error when user selects a type
                    }}
                  >
                    <option value="">Choose user type</option>
                    {options.map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                )}
                {errors.userType && (
                  <div className="invalid-feedback">{errors.userType}</div>
                )}
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              {label}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
