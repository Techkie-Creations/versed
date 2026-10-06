export function formatDate(dateStr: string) {
  const d = new Date(dateStr);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}, ${hours}:${minutes}`;
}

export const titleText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// OTHERS
export const solidButton =
  "border-2 rounded hover:bg-eerie hover:text-alice bg-alice text-eerie cursor-pointer p-2 w-full duration-300 ease-in-out";
export const hollowButton =
  "border-2 rounded hover:bg-alice hover:text-eerie bg-eerie text-alice cursor-pointer p-2 w-full duration-300 ease-in-out";

export const inputFocus =
  "focus:outline-0 focus-visible:border-l-0 focus-visible:border-2 border-alice";

export const checkboxDesign =
  "accent-eerie text-alice checked:ring-alice checked:ring-2";

export const radioDesign = "accent-eerie";

export const typicalLink = "hover:cursor-pointer text-eerie hover:underline";

export const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");

  return new Date(`${year}-${month}-${day}T${timePart}:00`);
};
