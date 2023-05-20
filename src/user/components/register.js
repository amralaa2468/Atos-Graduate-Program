import react, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { Form } from "./form";

export const Register = (creator) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const onSubmitRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          username,
          password,
          userType,
        }
      );
      if (userType !== "admin") {
        setCookies("access_token", response.data.token);
        setCookies("user_type", response.data.userType);
        setCookies("user_ID", response.data.userID);
        navigate("/");
      }
      alert("Registration completed.");
    } catch (err) {
      alert("Something went wrong can't sign up.");
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      userType={userType}
      setUserType={setUserType}
      onSubmit={onSubmitRegister}
      creator={creator}
      label="Register"
    />
  );
};
