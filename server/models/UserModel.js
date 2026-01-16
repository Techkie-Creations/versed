import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const UserSchema = new mongoose.Schema(
  {
    firstName: reqString,
    lastName: reqString,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: reqString,
    avatar: reqString,
    securityVerse: reqString,
    verseEncoded: reqString,
    bio: {
      type: String,
      default: "I am a child of His Majesty!",
    },
    dob: String,
    country: String,
    avatarId: String,
    passwordChanged: String,
    verseChanged: String,
  },
  {
    timestamps: true,
  }
);

const userDB = mongoose.connection.useDb("users");
const User = userDB.model("User", UserSchema);

export default User;
