import { useCookies } from "react-cookie";
import NotificationList from "../components/notifications-list";
import TeacherNotificationList from "../components/teacher-notifications-list";

export const Notifications = () => {
  const [cookies, setCookies] = useCookies([
    "access_token",
    "user_type",
    "user_ID",
  ]);

  let userID = cookies.user_ID;
  let userType = cookies.user_type;
  console.log("userID: " + userID);

  return (
    <>
      {userType === "student" ? (
        <NotificationList userID={userID} />
      ) : (
        <TeacherNotificationList userID={userID} />
      )}
    </>
  );
};
