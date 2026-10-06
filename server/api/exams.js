import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import Verses from "../models/VerseModel.js";
import { MockExam, OfficialExam } from "../models/ExamModel.js";
import { examId, removeKeys, userTZ, examDate } from "../helper/misc.js";

const router = express.Router();

router.get("/verses-info", validateToken, async (req, res) => {
  try {
    const verses = await Verses.findOne(
      { userId: req.info.userId },
      "verses mode",
    );
    const numofverses = Object.keys(verses.verses).length;
    return res
      .status(200)
      .json({ success: true, numofverses, mode: verses.mode });
  } catch (err) {
    console.error("Exam - # of Verses Error: ", err);
    return res.status(500).json({ success: false, message: "Server Error!!" });
  }
});

router
  .route("/mock-exam")
  .get(validateToken, async (req, res) => {
    try {
      const getMockExams = await MockExam.findOne({ userId: req.info.userId });
      const pastMockExams =
        getMockExams &&
        removeKeys(
          getMockExams.userExams.filter((exam) =>
            ["passed", "failed", "cancelled"].includes(exam.status),
          ),
          "_id",
          "delExamCount",
          "edited",
        );
      const upcomingExams =
        getMockExams &&
        removeKeys(
          [
            ...getMockExams.userExams.filter((exam) =>
              ["scheduled", "rescheduled", "upcoming", "in-progress"].includes(
                exam.status,
              ),
            ),
          ],
          "_id",
          "delExamCount",
          "edited",
        );
      return res
        .status(200)
        .json({ success: true, upcomingExams, pastMockExams });
    } catch (error) {
      console.error("Get Mock Exam Error: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error! Try Again!" });
    }
  })
  .post(validateToken, async (req, res) => {
    let mockExam;
    try {
      if (req.body.setDate) {
        mockExam = await MockExam.findOneAndUpdate(
          { userId: req.info.userId, "userExams.examid": req.body.examid },
          {
            $set: {
              "userExams.$.examDate": examDate(""),
              "userExams.$.startTime": examDate("start"),
              "userExams.$.endTime": examDate("end", req.body.duration),
            },
          },
        );
        return res.status(200).json({
          success: true,
          message: "Mock Exam Started!!",
          mockExams: removeKeys(
            mockExam.userExams,
            "delExamCount",
            "edited",
            "_id",
          ),
        });
      } else {
        const getMockExams = await MockExam.findOne({
          userId: req.info.userId,
        });
        const examNo = getMockExams ? getMockExams.userExams.length + 1 : 1;
        const examObject = {
          ...req.body,
          type: "mock",
          created: examDate("created"),
          examDate: "",
          startTime: "",
          title: `Mock Exam ${examNo}`,
          timezone: userTZ,
          examid: examId(req.info.userId, "mock", examNo),
        };

        if (!getMockExams) {
          mockExam = new MockExam({
            userId: req.info.userId,
            userExams: [examObject],
          });
          await mockExam.save();
        } else {
          mockExam = await MockExam.findOneAndUpdate(
            { userId: req.info.userId },
            { $push: { userExams: examObject } },
            { new: true },
          );
        }

        const exams = removeKeys(
          mockExam.userExams,
          "delExamCount",
          "edited",
          "_id",
        );
        return res.status(200).json({
          success: true,
          message: "Mock Exam Created!!",
          mockExams: exams,
        });
      }
    } catch (error) {
      console.error("Create Mock Exam Error: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error! Try Again!" });
    }
  })
  .put(validateToken, async (req, res) => {
    try {
      const updatedEntries = Object.fromEntries(
        Object.entries(req.body)
          .filter(([key]) => !["title"].includes(key))
          .map(([key, value]) => [`userExams.$.${key}`, value]),
      );
      updatedEntries["userExams.$.edited"] = new Date().toLocaleString(
        "en-GB",
        {
          timeStyle: "short",
          dateStyle: "short",
        },
      );
      const updateExam = await MockExam.findOneAndUpdate(
        {
          userId: req.info.userId,
          "userExams.examid": req.body.examid,
        },
        { $set: updatedEntries },
        { new: true },
      );

      const updated =
        updateExam.userExams[updateExam.userExams.length - 1].toObject();
      delete updated["delExamCount"];
      delete updated["edited"];
      delete updated["_id"];
      delete updated["rescheduleCount"];
      return res.status(200).json({
        success: true,
        message: "Mock Exam Edited!!",
        updated,
      });
    } catch (error) {
      console.error("Edit Mock Exam Error: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error! Try Again!" });
    }
  })
  .delete(validateToken, async (req, res) => {
    try {
      const deleteMockExam = await MockExam.findOneAndUpdate(
        { userId: req.info.userId },
        { $pull: { userExams: { examid: req.body.examid } } },
        { new: true },
      );
      const deleted = removeKeys(
        deleteMockExam.userExams,
        "_id",
        "delExamCount",
        "edited",
      );
      res.status(200).json({
        success: true,
        message: "Mock Exam Deleted!",
        deleted,
      });
    } catch (error) {
      console.error("Delete Mock Exam Error: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error! Try Again!" });
    }
  });

router.post("/official-exam", validateToken, async (req, res) => {
  try {
    const createExam = await OfficialExam.findOne({ userId: req.info.userId });
    res.status(200).json({
      success: true,
      message: "Official Exam Created!",
    });
  } catch (error) {
    console.error("Create Official Exam Error: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error! Try Again!" });
  }
});

export default router;
