import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import Verses from "../models/VerseModel.js";
import { verseId } from "../helper/misc.js";
import User from "../models/UserModel.js";

const router = express.Router();

router
  .route("/my-verses")
  .get(validateToken, async (req, res) => {
    try {
      const allVerses = await Verses.findOne(
        { userId: req.info.userId },
        "verses globalVersion mode verseId"
      );
      if (!allVerses) {
        return res.status(200).json({ success: true, verses: {} });
      }
      return res.status(200).json({
        success: true,
        verses: allVerses.verses,
        globalV: allVerses.globalVersion,
        verseId: allVerses.verseId,
        mode: allVerses.mode,
      });
    } catch (error) {
      console.error("Get Verses: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  })
  .post(validateToken, async (req, res) => {
    try {
      const existingVerse = await Verses.findOne({ userId: req.info.userId });
      if (!existingVerse) {
        const userInfo = await User.findById(req.info.userId);
        const globVer = userInfo.securityVerse.split(" ");
        const newVerse = new Verses({
          userId: req.info.userId,
          verseId: verseId(req.info.userId),
          verses: req.body.new,
          globalVersion: globVer.length === 4 ? globVer[3] : globVer[4],
          mode: Object.keys(req.body.new).length >= 30 ? "Mature" : "Newbie",
        });
        await newVerse.save();
        return res
          .status(200)
          .json({ success: true, message: "Verses Saved!" });
      }
      const { verses, newVerses, track } = req.body;
      const trackKeys = Object.keys(track);

      for (let i = 0; i < trackKeys.length; i++) {
        const trackId = track[trackKeys[i]];
        verseId["Version"] = trackId["Version"];
        verseId["Book"] = trackId["Book"];
        verseId["Chapter"] = trackId["Chapter"];
        verseId["Verse"] = trackId["Verse"];
        verseId["To"] = trackId["To"];
      }

      const allVerses = { ...verses, ...newVerses };

      const updatedVerses = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verses: allVerses },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Verses Saved!",
        verses: updatedVerses.verses,
      });
    } catch (error) {
      console.error("Verse Post: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  })
  .delete(validateToken, async (req, res) => {
    try {
      const deletedVerses = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verses: {} },
        { new: true }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Deleted Verses Successfully!",
          verses: deletedVerses.verses,
        });
    } catch (error) {
      console.error("DELETE VERSES", error);
      return res
        .json({ success: false, message: "Server Error... Try Again Later!" })
        .status(500);
    }
  });

export default router;
