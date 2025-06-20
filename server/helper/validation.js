import User from "../models/UserModel.js";

/**
 * Validates if user exists in user DB
 * @param {*} email email to check with
 * @param {*} schema Requires either login or signup
 * @returns A boolean value for signup schema and false or object for login schema
 */
export const validation = async (email, schema) => {
  try {
    const userExists = await User.findOne(
      { email: email },
      "firstName lastName password avatar verseEncoded"
    );
    if (schema === "login") {
      if (userExists) return userExists;
      return false;
    }
    if (schema === "signup") {
      if (userExists) return true;
      return false;
    }
    return "Unknown Schema!!";
  } catch (err) {
    console.error("Server Error....", err.message);
    return undefined;
  }
};
