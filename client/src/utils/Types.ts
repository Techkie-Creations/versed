export type ImageURL = {
  fileUrl: string;
  fileName: string;
  fileType: string;
};

export const imageObject: ImageURL[] = [];

export const defaultFileObj: ImageURL = {
  fileUrl:
    "https://res.cloudinary.com/dz6l4si8o/image/upload/v1751675985/Versed%20Avatars/default.jpg",
  fileName: "default.jpg",
  fileType: "image/jpg",
};

// BIBLICAL ZONE
export const bibleVersions = [
  "NKJV",
  "KJV",
  "AMP",
  "NIV",
  "MSG",
  "NLT",
  "CEV",
].sort();

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
