import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherNotificationList = ({ userID }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5004/api/notifications/getNotifications/${userID}`
        );
        const { notifications } = response.data;
        setNotifications(notifications);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, [userID]);

  return (
    <div>
      <h2 className="m-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="m-4 text-muted">No notifications until now.</p>
      ) : (
        <div className="m-4">
          {[...notifications].reverse().map((notification) => (
            <div className="card mb-3" key={notification._id}>
              <div className="card-body px-3">
                <h5 className="card-title">
                  {notification.message.notification}
                </h5>
                <p className="card-text">
                  Student {notification.message.username} submitted the exam.
                </p>
                <p className="card-text">
                  Exam name: {notification.message.examName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherNotificationList;
