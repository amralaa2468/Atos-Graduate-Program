import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

export const Profile = () => {
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [cookies] = useCookies(["access_token"]);

  let token = cookies.access_token;
  //console.log(token);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const getUser = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/profile",
            { headers }
          );
          //console.log(response.data.name);
          setUsername(response.data.name);
          setUserType(response.data.userType);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getUser();
  }, [token, headers]);

  return (
    <React.Fragment>
      {token ? (
        <div className="container py-4">
          <h1 className="mb-4">{username}'s Profile</h1>
          <ul className="list-group">
            <li className="list-group-item">
              <b>Username:</b> {username}
            </li>
            <li className="list-group-item">
              <b>User Type:</b> {userType}
            </li>
          </ul>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Login to view your profile</h5>
              <p className="card-text">
                Please log in to access your profile and personalized
                information.
              </p>
              <a href="/auth" className="btn btn-primary">
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
