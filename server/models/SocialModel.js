import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  facebook: String,
  x: String,
  linkedIn: String,
  web: String,
  instagram: String,
});

const socialDB = mongoose.connection.useDb("users");
const Socials = socialDB.model("Socials", SocialSchema);

export default Socials;
