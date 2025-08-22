import express from "express";
import { validateToken } from "../middleware/validateToken.js";
import User from "../models/UserModel.js";
import Socials from "../models/SocialModel.js";
import bcrypt from "bcrypt";
import { upload } from "../middleware/multer.js";
import { deleteImage, uploadImage } from "../cloudinary.js";
import { checkDate } from "../helper/misc.js";
import { validation } from "../helper/validation.js";

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
      try {
        const userEmail = await User.findById(req.info.userId, "email");
        if (req.body.email !== userEmail.email) {
          if (await validation(userEmail.email, "signup"))
            return res.status(403).json({
              success: false,
              message: "Email Is Unavailable!",
              field: true,
            });
        }
      } catch (error) {
        console.error(error, "Personal Email");
        return res
          .status(500)
          .json({ success: false, message: "Server Error.. Try Again Later!" });
      }

      let avatarUrl = req.body.avatarUrl;
      let avatarId = null;
      if (req.body.defaultAvatar === "false") {
        try {
          const publicId = await User.findById(req.info.userId, "avatarId");
          if (publicId.avatarId) {
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

// Get and update user socials
router
  .route("/socials")
  .get(validateToken, async (req, res) => {
    try {
      const userSocials = await Socials.findOne({ userId: req.info.userId });
      const socials = userSocials
        ? {
            facebook: userSocials.facebook,
            web: userSocials.web,
            x: userSocials.x,
            instagram: userSocials.instagram,
            linkedIn: userSocials.linkedIn,
          }
        : null;
      return res.status(200).json({ success: true, socials });
    } catch (error) {
      console.error("Socials", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error!!" });
    }
  })
  .post(validateToken, async (req, res) => {
    try {
      const userSocials = await Socials.findOne(
        { userId: req.info.userId },
        "facebook instagram x linkedIn web"
      );
      if (!userSocials) {
        const newSocials = new Socials({
          userId: req.info.userId,
          facebook: req.body.facebook,
          instagram: req.body.instagram,
          linkedIn: req.body.linkedIn,
          x: req.body.x,
          web: req.body.web,
        });
        await newSocials.save();
        return res
          .status(200)
          .json({ success: true, message: "Updated Social Links" });
      }
      await Socials.findOneAndUpdate(
        { userId: req.info.userId },
        {
          facebook: req.body.facebook,
          x: req.body.x,
          instagram: req.body.instagram,
          linkedIn: req.body.instagram,
          web: req.body.web,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Updated Social Links" });
    } catch (error) {
      console.error("Social Update", error);
      return res
        .status(500)
        .json({ success: false, meesage: "Server Error... Try Again Later!" });
    }
  });

// Change Password
router.post("/changePassword", validateToken, async (req, res) => {
  const { section } = req.body;
  if (section === "check") {
    try {
      const existingUser = await User.findById(
        req.info.userId,
        "password passwordChanged"
      );

      const [canChange, daysDiff] = checkDate(existingUser.passwordChanged, 7);

      if (!canChange)
        return res
          .json({
            success: false,
            message: `Wait ${daysDiff} Days To Change Your Password!`,
            root: true,
          })
          .status(403);
      const matching = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );
      if (!matching) {
        return res
          .json({
            success: false,
            message: "Incorrect Password!",
            field: true,
          })
          .status(403);
      }
      return res.status(200).json({ success: true, message: "Proceed!" });
    } catch (error) {
      console.error("Change Password", error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  }
  if (section === "pwdReset") {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(
        req.info.userId,
        {
          password: hashedPassword,
          passwordChanged: new Date().toLocaleDateString(),
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Password Reset Successfull!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  }
});

router
  .route("/securityVerse")
  .get(validateToken, async (req, res) => {
    try {
      const securityVerse = await User.findById(
        req.info.userId,
        "securityVerse"
      );
      let verse = securityVerse.securityVerse.split(" ");

      if (verse.length > 4)
        verse = {
          version: verse[4],
          book: `${verse[0]} ${verse[1]}`,
          chapter: verse[2],
          verse: verse[3],
        };
      else
        verse = {
          version: verse[3],
          book: verse[0],
          chapter: verse[1],
          verse: verse[2],
        };

      return res.status(200).json({
        success: true,
        verse,
      });
    } catch (error) {
      console.error(error, "Error");
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  })
  .post(validateToken, async (req, res) => {
    try {
      const verseChanged = await User.findById(req.info.userId, "verseChanged");
      const [canChange, daysDiff] = checkDate(verseChanged.verseChanged, 30);

      if (!canChange)
        return res
          .json({
            success: false,
            message: `Wait ${daysDiff} Days To Change Security Verse!`,
            root: true,
          })
          .status(403);
      await User.findByIdAndUpdate(
        req.info.userId,
        {
          securityVerse: `${req.body.book} ${req.body.chapter} ${req.body.verse} ${req.body.version}`,
          verseChanged: new Date().toLocaleDateString(),
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Successfully Updated Security Verse!",
      });
    } catch (error) {
      console.error(error, "Favorite");
      return res
        .status(500)
        .json({ success: false, message: "Server Error... Try Again Later!" });
    }
  });

router.delete("/deleteAccount", validateToken, async (req, res) => {
  try {
    const deletedUser = await User.findById(req.info.userId);
    if (deletedUser.avatarId) {
      const deleted = await deleteImage(deletedUser.avatarId);
      if (!deleted)
        return res.status(500).json({
          success: false,
          message: "Server Error... Try Again Later!",
        });
    }
    await User.findByIdAndDelete(req.info.userId);
    await Socials.findOneAndDelete({ userId: req.info.userId });
    return res
      .clearCookie("accessToken", {
        path: "/",
        domain: "localhost",
        httpOnly: true,
      })
      .clearCookie("refreshToken", {
        path: "/",
        domain: "localhost",
        httpOnly: true,
      })
      .status(200)
      .json({ success: true, message: "Account Deleted Successfully!" });
  } catch (error) {
    console.error("DELETED", error);
    return res
      .json({ success: false, message: "Server Error... Try Again Later!" })
      .status(500);
  }
});

export default router;
