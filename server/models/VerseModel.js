import mongoose from "mongoose";

const VerseSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  verseId: {
    type: String,
    unique: true,
    required: true,
  },
  verses: {
    type: Object,
    default: {},
  },
  globalVersion: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: "Newbie",
  },
  versePass: {
    type: String,
    default: "",
  },
  verseVisibility: {
    type: String,
    default: "Private",
  },
  verseAccess: {
    type: [String],
    default: [],
  },
});

const verseDB = mongoose.connection.useDb("verses");
const Verses = verseDB.model("Verses", VerseSchema);

export default Verses;
