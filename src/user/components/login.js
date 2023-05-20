import { useState } from "react";

import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { Form } from "./form";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const onSubmitLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username,
          password,
        }
      );
      setCookies("access_token", response.data.token);
      setCookies("user_type", response.data.userType);
      setCookies("user_ID", response.data.userID);
      navigate("/");
      alert("Login completed.");
    } catch (err) {
      alert("Something went wrong can't login.");
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={onSubmitLogin}
      label="Login"
    />
  );
};
