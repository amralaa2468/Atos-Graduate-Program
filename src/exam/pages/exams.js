import CreateExamForm from "../components/create-exam-form";
import TeacherExamList from "../components/teacher-exams-list";

export const Exams = () => {
  return (
    <>
      <CreateExamForm />
      <hr />
      <TeacherExamList />
    </>
  );
};
