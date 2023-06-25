const createExamDefinition =
  "INSERT INTO exams_definition (name, questions, assignedTo, createdBy) VALUES ($1, $2, $3, $4)";

const getTeacherExamsDefinition =
  "SELECT * FROM exams_definition WHERE $1 = createdBy";

const createExamInstance =
  "INSERT INTO exams_instance (examDefinitionID, duration, createdBy, generatedLink, assignedTo) VALUES ($1, $2, $3, $4, $5)";

const getAssignedToFromExamDefinition =
  "SELECT assignedto, name FROM exams_definition WHERE id = $1";

const getExamSubmittedNotificationInfo =
  "SELECT username, createdby, generatedlink FROM exams_instance WHERE id = $1";

const getExamCorrectedNotificationInfo =
  "SELECT grade, passed, generatedlink, assignedto FROM exams_instance WHERE id = $1";

const getStudentExams =
  "SELECT ei.id AS examInstanceID, ed.name, ei.status FROM exams_definition ed JOIN exams_instance ei ON ed.id = ei.examdefinitionid WHERE $1 = ei.assignedto AND $2 > (ei.generatedlink->>'scheduledTimeFrom')::timestamptz AND $2 < (ei.generatedlink->>'scheduledTimeTo')::timestamptz";

const getQuestionsFromExamDefinition =
  "SELECT ed.questions, ei.duration FROM exams_definition ed JOIN exams_instance ei ON ed.id = ei.examdefinitionid where $1 = ei.id";

const submitExam =
  "UPDATE exams_instance SET starttime = $1, endtime = $2, takenby = $3, status = $4, questions = $5, grade = $7, passed = $8, username = $9 WHERE id = $6;";

export default {
  createExamDefinition,
  getTeacherExamsDefinition,
  createExamInstance,
  getStudentExams,
  getQuestionsFromExamDefinition,
  submitExam,
  getAssignedToFromExamDefinition,
  getExamSubmittedNotificationInfo,
  getExamCorrectedNotificationInfo,
};
