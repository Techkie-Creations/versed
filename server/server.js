import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./api/auth.js";
import { connectDB } from "./config/dbconfig.js";
import { validateToken } from "./middleware/validateToken.js";

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

// app.get("/checkUser", validateToken(), (req, res) => {
//   console.log("REACHED");
// });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});

// John@jon.com Kryptonium@7
