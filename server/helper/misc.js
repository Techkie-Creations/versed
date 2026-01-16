const assign = {
  A: "13",
  B: "12",
  C: "11",
  D: "10",
  E: "09",
  F: "08",
  G: "07",
  H: "06",
  I: "05",
  J: "04",
  K: "03",
  L: "02",
  M: "01",
  N: "14",
  O: "15",
  P: "16",
  Q: "17",
  R: "18",
  S: "19",
  T: "26",
  U: "25",
  V: "24",
  W: "23",
  X: "22",
  Y: "21",
  Z: "20",
  ":": "27",
  " ": "_",
};

/**
 * Encodes favorite memory verse
 * @param {*} favVerse Book Chapter:Verse
 * @param {*} compare Encoded verse to compare with
 * @returns Memory verse encoded for password reset
 */
export const verseEncoder = (favVerse, compare = "") => {
  let encoded = "";
  for (let i = 0; i < favVerse.length; i++) {
    encoded += assign[favVerse.charAt(i).toUpperCase()] || favVerse.charAt(i);
  }
  if (compare.length === 0) return encoded;

  if (compare.length > 0) {
    return encoded === compare;
  }
};

/**
 * Capitalizes the full name of the user
 * @param {*} firstName User's first name
 * @param {*} lastName User's last name
 * @returns capitalized joining of the two
 */
export const fullName = (firstName, lastName) => {
  const fname = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const lname = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  return `${fname} ${lname}`;
};

/**
 * Generates a random numeric based code
 * @param {*} num Determines the code's length
 * @returns only numeric based code
 */
export const codeGenerator = (num) => {
  let code = "";
  while (code.length < num) {
    code += `${Math.floor(Math.random() * 10)}`;
  }
  return code;
};

/**
 * Used to check if the days elapsed between change date and current date is sufficient for change
 * @param {*} changeDate Date when the change was made
 * @param {*} daysElapsed How many days must have elapsed before change is possible
 * @returns [boolean, daysElapsed - changeDate || null]
 */
export const checkDate = (changeDate, daysElapsed) => {
  if (!changeDate) return [true, null];
  const daysLeft = Math.floor(
    Math.abs(new Date() - new Date(changeDate)) / (1000 * 60 * 60 * 24)
  );
  const today = new Date().toLocaleDateString();

  if (daysLeft < daysElapsed || today === existingUser.passwordChanged)
    return [false, daysElapsed - daysLeft];
  return [true, null];
};

// import axios from "axios";
// import fs from "fs";
// export const getCountries = async () => {
//   let obj = [];
//   const countries = await axios
//     .get("https://www.apicountries.com/countries")
//     .then((res) => res.data)
//     .catch((err) => err.response.data);
//   for (let i = 0; i < countries.length; i++) {
//     const bracket = countries[i]["name"].indexOf("(");
//     console.log(bracket);
//     if (bracket >= 0) {
//       obj.push({
//         name: countries[i]["name"].slice(0, bracket),
//         flag: countries[i]["flag"],
//       });
//     }
//     obj.push({ name: countries[i]["name"], flag: countries[i]["flag"] });
//   }
// };

// getCountries();
