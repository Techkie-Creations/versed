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

// OTHERS
export const solidButton =
  "border-2 rounded hover:bg-eerie hover:text-alice bg-alice text-eerie cursor-pointer p-2 w-full duration-300 ease-in-out";
export const hollowButton =
  "border-2 rounded hover:bg-alice hover:text-eerie bg-eerie text-alice cursor-pointer p-2 w-full duration-300 ease-in-out";

export const inputFocus =
  "focus:outline-0 focus-visible:border-l-0 focus-visible:border-2 border-alice";
