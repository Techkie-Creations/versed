import express from "express";
import bcrypt from "bcrypt";
import { upload } from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";
import { validation } from "../helper/validation.js";
import User from "../models/UserModel.js";
import {
  codeGenerator,
  fullName,
  registerUser,
  verseEncoder,
} from "../helper/misc.js";
import { generateAccessToken, generateRefreshToken } from "../helper/tokens.js";
import dotenv from "dotenv";
import { uploadImage } from "../cloudinary.js";
import Verses from "../models/VerseModel.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const router = express.Router();

// /api/auth

// /register
router.post("/register", upload.single("avatar"), async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    version,
    book,
    chapter,
    verse,
    defaultAvatar,
  } = req.body;

  if (await validation(email, "signup"))
    return res.status(400).json({
      success: false,
      level: "email",
      message: "Email already exists!",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  let avatarUrl =
    "https://res.cloudinary.com/dz6l4si8o/image/upload/v1749147924/Versed%20Avatars/default.jpg";
  let avatarId = null;
  if (defaultAvatar === "false") {
    try {
      [avatarUrl, avatarId] = await uploadImage(
        req.file.buffer,
        req.file.mimetype
      );
    } catch (error) {
      console.error(error, "Failed");
      return res.status(500).json({
        success: false,
        level: "root",
        message: "Server Error...",
      });
    }
  }

  const securityVerse = `${book} ${chapter} ${verse} ${version}`;
  const verseEncoded = verseEncoder(`${book} ${chapter}:${verse}`);

  const newUser = new User({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    avatar: avatarUrl,
    securityVerse,
    verseEncoded,
    avatarId: avatarId,
  });

  try {
    await newUser.save();

    const regUser = await registerUser(newUser._id.toString(), {
      gbv: version,
    });
    if (!regUser)
      return res.json({
        success: false,
        message: "Server Error... Try Again Later",
      });

    const refreshToken = generateRefreshToken(newUser._id);

    res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .cookie("accessToken", generateAccessToken(newUser._id), {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      });
    res.status(200).json({
      success: true,
      message: "Sign Up Successfull!!",
      avatarUrl,
      name: fullName(newUser.firstName, newUser.lastName),
    });
  } catch (err) {
    console.error("Server Error... hERE", err.message);
    res.status(500).json({
      success: false,
      message: "Server Error... Try Again Later!",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await validation(email.toLowerCase(), "login");
  if (!existingUser)
    return res
      .status(403)
      .json({ success: false, message: "Invalid Email or Password!" });
  const matching = await bcrypt.compare(password, existingUser.password);

  if (matching)
    return res
      .cookie("refreshToken", generateRefreshToken(existingUser._id), {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .cookie("accessToken", generateAccessToken(existingUser._id), {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        success: true,
        message: "Login Successful!",
        avatar: existingUser.avatar,
        name: fullName(existingUser.firstName, existingUser.lastName),
      });
  else
    return res
      .status(403)
      .json({ success: false, message: "Invalid Email or Password!" });
});

let resetCode = {};

router.post("/forgotPassword", async (req, res) => {
  const { section, email } = req.body;

  if (section === "email") {
    const { encryptedVerse, book, chapter, verse } = req.body;
    const existingUser = await validation(email.toLowerCase(), "login");

    if (!existingUser)
      return res
        .status(401)
        .json({ success: false, message: "User Does Not Exist!" });

    if (existingUser.verseEncoded !== encryptedVerse)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Email or Wrong Verses!!" });

    if (verseEncoder(`${book} ${chapter}:${verse}`, encryptedVerse)) {
      resetCode[`${email}`] = codeGenerator(5);
      return res.status(202).json({
        success: true,
        message: "Able to reset password",
        email: email,
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Incorrect Email or Wrong Verses!!" });
  }
  if (section === "code") {
    const { code, resend } = req.body;
    if (resend) {
      resetCode[`${email}`] = codeGenerator(5);
      return res
        .status(200)
        .json({ success: true, message: "Resent the code!" });
    }
    if (resetCode[`${email}`] === code)
      return res.status(202).json({ success: true, message: "Proceed", email });
    return res.status(401).json({ success: false, message: "Incorrect Code" });
  }
  if (section === "pwdReset") {
    const { password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true }
      );
      delete resetCode[`${email}`];
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

router.post("/logout", (_, res) => {
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
    .json({ success: true, message: "Logged Out Successfully!" });
});

export default router;
