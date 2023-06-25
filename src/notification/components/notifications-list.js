import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationList = ({ userID }) => {
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

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h2 className="m-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="m-4 text-muted">No notifications until now.</p>
      ) : (
        <div className="m-4">
          {[...notifications].reverse().map((notification) => (
            <div className="mb-3" key={notification._id}>
              <div className="card">
                <div className="card-body d-flex justify-content-between px-3">
                  {notification.message.notification ===
                  "You have been assigned an exam." ? (
                    <>
                      <div>
                        <h5 className="card-title">
                          {notification.message.notification}
                        </h5>
                        <p className="card-text">
                          Exam link:{" "}
                          <a href={notification.message.url}>Go to exam</a>
                        </p>
                        <p className="card-text">
                          Exam Name: {notification.message.examName}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-right">
                          Scheduled Time From:{" "}
                          {formatDateTime(
                            notification.message.scheduledTimeFrom
                          )}
                        </p>
                        <p className="text-right">
                          Scheduled Time To:{" "}
                          {formatDateTime(notification.message.scheduledTimeTo)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h5 className="card-title">
                          {notification.message.notification}
                        </h5>
                        <p className="card-text">
                          Exam Name: {notification.message.examName}
                        </p>
                        <p className="card-text">
                          Grade: {notification.message.grade}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="text-right">
                          Passed:{" "}
                          {notification.message.passed
                            ? "Passed successfully"
                            : "Failed"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
