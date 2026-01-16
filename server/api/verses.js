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
        "verseId verses globalVersion mode"
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
        {
          verses: allVerses,
          mode: Object.keys(allVerses).length >= 30 ? "Mature" : "Newbie",
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Verses Saved!",
        verses: updatedVerses.verses,
        mode: updatedVerses.mode,
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
      await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verses: {} },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Deleted Verses Successfully!",
      });
    } catch (error) {
      console.error("DELETE VERSES", error);
      return res
        .json({ success: false, message: "Server Error... Try Again Later!" })
        .status(500);
    }
  });

router
  .route("/verse-sec")
  .get(validateToken, async (req, res) => {
    try {
      const verseSec = await Verses.findOne(
        { userId: req.info.userId },
        "versePass verseVisibility verseAccess"
      );
      return res.status(200).json({
        success: true,
        versePass: verseSec.versePass,
        verseVisibility: verseSec.verseVisibility,
        verseAccess: verseSec.verseAccess,
      });
    } catch (error) {
      console.error("Verse SEC: ", error);
      return res
        .json({ success: false, message: "Server Error... Try Again Later!" })
        .status(500);
    }
  })
  .post(validateToken, async (req, res) => {
    try {
      await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verseAccess: req.body.verseAccess },
        { new: true }
      );
      if (req.body.schema === "addUser")
        return res.status(200).json({
          success: true,
          message: "User Added",
        });
      if (req.body.schema === "removeUser")
        return res.status(200).json({
          success: true,
          message: "User Removed",
        });
    } catch (error) {
      console.error("Verse Sec Change: ", error);
      return res
        .json({ success: false, message: "Server Error... Try Again Later!" })
        .status(500);
    }
  });

router.post("/import-verses", validateToken, async (req, res) => {
  try {
    const getUser = await Verses.findOne({ userId: req.info.userId });
    if (getUser.verseId === req.body.verseId)
      return res
        .json({ success: false, message: "Cannot Import From Yourself" })
        .status(401);
    const getUserEmail = await User.findById(req.info.userId, "email");
    const getVerses = await Verses.findOne({ verseId: req.body.verseId });
    if (!getVerses)
      return res
        .json({ success: false, message: "Verse ID Not Found!" })
        .status(404);
    if (req.body.schema === "verseId") {
      if (getVerses.verseVisibility === "public") {
        if (getVerses.versePass.length > 0)
          return res.status(200).json({ success: true, pass: true });
        else
          return res
            .status(200)
            .json({ success: true, verses: getVerses.verses });
      }
      if (getVerses.verseVisibility === "private") {
        if (getVerses.verseAccess.indexOf(getUserEmail.email) >= 0)
          return res
            .status(200)
            .json({ success: true, verses: getVerses.verses });
        else
          return res
            .json({
              success: false,
              message:
                "Ask User To Change Verse Visibility To Public Or Ask To Be Added To Their Access List",
            })
            .status(403);
      }
    }
    if (req.body.schema === "versePass") {
      if (getVerses.versePass === req.body.versePass)
        return res
          .status(200)
          .json({ success: true, verses: getVerses.verses });
      else
        return res
          .json({ success: false, message: "Verse ID or Password Incorrect!" })
          .status(403);
    }
    if (req.body.schema === "submit") {
      const verses = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verses: req.body.verses },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Imported Successfully!",
        verses: verses.verses,
      });
    }
  } catch (error) {
    console.error("Verse Import: ", error);
    return res
      .json({ success: false, message: "Server Error... Try Again Later!" })
      .status(500);
  }
});

router.post("/verses-misc", validateToken, async (req, res) => {
  try {
    if (req.body.schema === "password") {
      const versePass = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { versePass: req.body.versePass },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Verse Password Changed",
        versePass: versePass.versePass,
      });
    }
    if (req.body.schema === "visibility") {
      const versePass = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { verseVisibility: req.body.verseVisibility },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Verse Visibility Changed",
        versePass: versePass.verseVisibility,
      });
    }
    if (req.body.schema === "globalV") {
      const globalV = await Verses.findOneAndUpdate(
        { userId: req.info.userId },
        { globalVersion: req.body.globalV },
        { new: true }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Global Version Changed",
          globalV: globalV.globalVersion,
        });
    }
  } catch (error) {
    console.error("Verses Misc: ", error);
    return res.json({ success: false, message: "Server Error... Try Again!" });
  }
});

export default router;
