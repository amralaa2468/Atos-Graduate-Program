import React from "react";
import { useCookies } from "react-cookie";

import CreateQuestionForm from "../components/create-question-from";
import QuestionsList from "../components/questions-list";

export const Questions = () => {
  const [cookies] = useCookies(["user_type"]);
  const userType = cookies.user_type;

  return (
    <React.Fragment>
      {userType !== "admin" ? (
        <>
          <CreateQuestionForm></CreateQuestionForm>
          <hr />
          <QuestionsList></QuestionsList>
        </>
      ) : (
        <QuestionsList></QuestionsList>
      )}
    </React.Fragment>
  );
};
