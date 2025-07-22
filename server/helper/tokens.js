import jwt from "jsonwebtoken";

/**
 * Generates A Access Token
 * @param {*} userId
 * @returns accessToken
 */
export const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "2m",
    issuer: `http://localhost:${process.env.PORT || 5000}`,
  });
  console.log(accessToken, "ACCESS TOKEN");
  return accessToken;
};

/**
 * Generates A Refresh Token
 * @param {*} userId
 * @returns refreshToken
 */
export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "3m",
      issuer: `http://localhost:${process.env.PORT || 5000}`,
    }
  );
  console.log(refreshToken, "REFRESH TOKEN");
  return refreshToken;
};

/**
 * Updates Access Token
 * @param {*} userId
 * @param {*} refreshToken
 * @returns new Access Token
 */
export const updateAccessToken = (userId, refreshToken) => {
  if (!refreshToken) return false;
  const newAccessToken = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, _) => {
      if (err) return null;
      return generateAccessToken(userId);
    }
  );
  return newAccessToken;
};
