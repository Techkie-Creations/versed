import { defaultAvatar } from "./FileObject";

export type ImageURL = {
  fileUrl: string;
  fileName: string;
  fileType: string;
};

export const imageObject: ImageURL[] = [];

export const defaultFileObj: ImageURL = {
  fileUrl: defaultAvatar,
  fileName: "default.jpg",
  fileType: "image/jpg",
};

export const solidButton =
  "border-2 rounded hover:bg-eerie hover:text-alice bg-alice text-eerie cursor-pointer p-2 w-full";
export const hollowButton =
  "border-2 rounded hover:bg-alice hover:text-eerie bg-eerie text-alice cursor-pointer p-2 w-full";

// BIBLICAL ZONE
export const allBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song Of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggi",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelations",
];
