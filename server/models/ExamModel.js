import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

// const ExamObject = new mongoose.Schema({
//   examid: reqString,
//   examDate: reqString,
//   startTime: reqString,
//   status: reqString, // passed, failed, upcoming, rescheduled, in-progress, canceled
//   title: reqString,
//   type: reqString, // official, mock
//   timezone: reqString,
//   duration: reqString,
//   includeFailed: {
//     type: Boolean,
//     required: true,
//   },
//   rescheduleCount: {
//     type: Number,
//     default: 0,
//   },
// });

const ExamSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  userExams: [
    {
      examid: reqString,
      examDate: { type: String, default: "" },
      startTime: { type: String, default: "" },
      endTime: { type: String, default: "" },
      status: reqString, // passed, failed, upcoming, rescheduled, in-progress, canceled
      title: reqString,
      type: reqString, // official, mock
      timezone: reqString,
      duration: { type: Number, default: 5 },
      includeFailed: {
        type: Boolean,
        required: true,
      },
      rescheduleCount: {
        type: Number,
        default: 0,
      },
      created: reqString,
      numofverses: {
        type: Number,
        required: true,
      },
      edited: { type: String, default: "" },
      delExamCount: { type: Number, default: 0 },
    },
  ],
});

const examDB = mongoose.connection.useDb("exams");
export const MockExam = examDB.model("mock", ExamSchema);
export const OfficialExam = examDB.model("official", ExamSchema);
