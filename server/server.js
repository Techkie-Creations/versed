import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./api/auth.js";
import accountRouter from "./api/useraccount.js";
import verseRouter from "./api/verses.js";
import { connectDB } from "./config/dbconfig.js";
import { validateToken } from "./middleware/validateToken.js";
import User from "./models/UserModel.js";
import { fullName } from "./helper/misc.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", accountRouter);
app.use("/api/verses", verseRouter);

app.get("/api/checkUser", validateToken, async (req, res) => {
  try {
    const userDetails = await User.findById(
      req.info.userId,
      "firstName lastName avatar"
    );
    return res
      .cookie("accessToken", req.info.token, {
        expires: new Date(Date.now() + 3 * 60 * 1000),
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        name: fullName(userDetails.firstName, userDetails.lastName),
        avatar: userDetails.avatar,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error..." });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});

// John@jon.com Kryptonium@7
