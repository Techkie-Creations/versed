// VERSES
export const verseChange = (
  index: number,
  text: string | number,
  part: string,
  schema: "track" | "new"
) => {
  const track = JSON.parse(localStorage.getItem("track") || "{}");
  const trackNew = JSON.parse(localStorage.getItem("trackNew") || "{}");
  if (schema === "track") {
    if (Object.keys(track).length === 0 || !track[index]) track[index] = {};
    track[index][part] = text;
    localStorage.setItem("track", JSON.stringify(track));
  }

  if (schema === "new") {
    trackNew[index][part] = text;
    localStorage.setItem("trackNew", JSON.stringify(trackNew));
  }

  if (part === "Book") return "Select Book";
  if (part === "Version") return "NKJV";
  return part;
};

export const checkVerses = (verses: Object, otherVerses: Object) => {
  const versesKey = Object.keys(verses);
  const otherVersesKeys = Object.keys(otherVerses);

  const existing = {};

  for (let i = 0; i < versesKey.length; i++) {
    for (let j = 0; j < otherVersesKeys.length; j++) {
      const otherVerseId = otherVerses[otherVersesKeys[j]];
      const verseId = verses[versesKey[i]];

      if (
        verseId["Book"] === otherVerseId["Book"] &&
        verseId["Chapter"] === otherVerseId["Chapter"] &&
        verseId["Verse"] === otherVerseId["Verse"] &&
        ((verseId["To"] === "*" && otherVerseId["To"] === ".") ||
          verseId["To"] === otherVerseId["To"] ||
          (verseId["To"] === "." && otherVerseId["To"] === "*"))
      ) {
        existing[otherVersesKeys[j]] = verseId;
      }
    }
  }

  const existingKeys = Object.keys(existing);
  if (existingKeys.length === otherVersesKeys.length) otherVerses = {};
  else if (existingKeys.length > otherVersesKeys.length)
    return { status: false, data: { msg: "Something Went Wrong!" } };
  else {
    for (let e = 0; e < existingKeys.length; e++) {
      delete otherVerses[existingKeys[e]];
    }
  }

  if (Object.keys(otherVerses).length === 0)
    return {
      status: false,
      data: { msg: "Verses Already Exist! Nothing to Import" },
    };

  const sort = {};

  for (let i = 0; i < otherVersesKeys.length; i++) {
    if (!otherVerses[otherVersesKeys[i]]) continue;
    sort[versesKey.length++] = otherVerses[otherVersesKeys[i]];
  }

  otherVerses = sort;

  return { status: true, data: otherVerses };
};

export const fitVerseIn = (verses: Object, fitIn: Object, id: number) => {
  const versesKey = Object.keys(verses);
  let hold = {};
  console.log(fitIn, id);
  console.log(verses);

  delete fitIn["Part"];
  delete fitIn["Id"];

  if (id >= versesKey.length) return (hold = { ...verses, [id]: fitIn });
  for (let i = 0; i < versesKey.length; i++) {
    const verseId = parseInt(versesKey[i]);
    if (verseId < id) hold[verseId] = verses[verseId];
    if (verseId == id) {
      hold[id] = fitIn;
      hold[id + 1] = verses[id];
    }
    if (verseId > id) {
      hold[verseId + 1] = verses[verseId];
    }
  }

  console.log(hold);
  return hold;
};

// export const checkExistingVerse = (
//   verses: Object,
//   trackNew: Object,
//   book: string,
//   chapter: string,
//   verse: string,
//   toVerse: string,
//   versesKeys: string[],
//   trackNewKeys: string[]
// ) => {
//   for (let i = 0; i < versesKeys.length; i++) {
//     const trackId = verses[versesKeys[i]];
//     if (
//       trackId["Book"] === book &&
//       trackId["Chapter"] === chapter &&
//       trackId["Verse"] === verse &&
//       (trackId["To"] === toVerse ||
//         trackId["To"] === "*" ||
//         parseInt(trackId["To"]) >= parseInt(toVerse))
//     ) {
//       return { status: false, message: "Verse Already Covered" };
//     } else if (
//       trackId["Book"] === book &&
//       trackId["Chapter"] === chapter &&
//       trackId["Verse"] === verse &&
//       (trackId["To"] === "." || parseInt(trackId["To"]) > parseInt(verse)) &&
//       toVerse === "*"
//     ) {
//       return { status: false, message: "* Covers A Verse That Already Exists" };
//     }
//   }
//   for (let i = 0; i < trackNewKeys.length; i++) {
//     const trackNewId = trackNew[trackNewKeys[i]];
//     if (
//       trackNewId["Book"] === book &&
//       trackNewId["Chapter"] === chapter &&
//       trackNewId["Verse"] === verse &&
//       (trackNewId["To"] === toVerse ||
//         trackNewId["To"] === "*" ||
//         parseInt(trackNewId["To"]) >= parseInt(toVerse))
//     ) {
//       return { status: false, message: "Verse Already Covered" };
//     } else if (
//       trackNewId["Book"] === book &&
//       trackNewId["Chapter"] === chapter &&
//       trackNewId["Verse"] === verse &&
//       (trackNewId["To"] === "." ||
//         parseInt(trackNewId["To"]) > parseInt(verse)) &&
//       toVerse === "*"
//     ) {
//       return { status: false, message: "* Covers A Verse That Already Exists" };
//     }
//   }
//   return { status: true, message: "" };
// };

// OTHERS
export const solidButton =
  "border-2 rounded hover:bg-eerie hover:text-alice bg-alice text-eerie cursor-pointer p-2 w-full duration-300 ease-in-out";
export const hollowButton =
  "border-2 rounded hover:bg-alice hover:text-eerie bg-eerie text-alice cursor-pointer p-2 w-full duration-300 ease-in-out";

export const inputFocus =
  "focus:outline-0 focus-visible:border-l-0 focus-visible:border-2 border-alice";
