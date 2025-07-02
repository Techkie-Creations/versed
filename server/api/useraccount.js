import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import User from "../models/UserModel.js";
import Socials from "../models/SocialModel.js";
import mongoose from "mongoose";
import { upload } from "../middleware/multer.js";
import { deleteImage, uploadImage } from "../cloudinary.js";

const router = express.Router();

// Get user details
router
  .route("/profile")
  .get(validateToken, async (req, res) => {
    try {
      const userProfile = await User.findById(
        req.info.userId,
        "firstName lastName email dob country bio avatar"
      );
      const profile = userProfile
        ? {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            dob: userProfile.dob,
            country: userProfile.country,
            bio: userProfile.bio,
            avatar: userProfile.avatar,
          }
        : null;
      return res.status(200).json({ success: true, profile });
    } catch (error) {
      console.error("Profile Error", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error!!" });
    }
  })
  .post(validateToken, upload.single("avatar"), async (req, res) => {
    const { schema } = req.body;
    if (schema === "bio") {
      try {
        await User.findByIdAndUpdate(
          req.info.userId,
          { bio: req.body.bio },
          { new: true }
        );

        return res
          .status(200)
          .json({ success: true, message: "Bio Updated Successfully!" });
      } catch (error) {
        console.error("Bio", error);
        return res
          .status(500)
          .json({ success: false, message: "Server Error.. Try Again Later!" });
      }
    }

    if (schema === "personal") {
      let avatarUrl = req.body.avatarUrl;
      let avatarId = null;
      if (req.body.defaultAvatar === "false") {
        console.log("REACEHD");
        try {
          const publicId = await User.findById(req.info.userId, "avatarId");
          console.log(publicId);
          if (publicId) {
            const deleted = await deleteImage(publicId.avatarId);
            if (!deleted)
              return res.status(500).json({
                success: false,
                message: "Server Error... Try Again Later!",
              });
          }
          [avatarUrl, avatarId] = await uploadImage(
            req.file.buffer,
            req.file.mimetype
          );
          console.log(avatarUrl, avatarId);
          return res.json({ success: true, message: "Updated Image!" });
        } catch (error) {
          console.error(error, "Profile Image");
          return res.status(500).json({
            success: false,
            level: "root",
            message: "Server Error...",
          });
        }
      }
      try {
        await User.findByIdAndUpdate(
          req.info.userId,
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            dob: req.body.dob,
            country: req.body.country,
            avatar: avatarUrl,
            avatarId: avatarId,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ success: true, message: "Info Updated Successfully!" });
      } catch (error) {
        console.error("Personal", error);
        return res.status(500).json({
          success: false,
          message: "Server Error... Try Again Later!",
        });
      }
    }
  });

router.route("/socials").get(validateToken, async (req, res) => {
  try {
    const userSocials = await Socials.findOne({ userId: req.info.userId });
    const socialInfo = userSocials
      ? {
          facebook: userSocials.facebook,
          web: userSocials.web,
          x: userSocials.x,
          instagram: userSocials.instagram,
          linkedIn: userSocials.linkedIn,
        }
      : null;
    return res.status(200).json({ success: true, socialInfo });
  } catch (error) {
    console.error("Socials", error);
    return res.status(500).json({ success: false, message: "Server Error!!" });
  }
});

export default router;
