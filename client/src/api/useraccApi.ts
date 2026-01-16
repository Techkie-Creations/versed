import { api } from "./base";

/* USER ACCOUNT */

// Profile Section
export const getUserProfile = async () => {
  const results = await api
    .get("/user/profile", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

export const updateUserProfile = async (
  formData: Object | FormData,
  schema: "bio" | "personal"
) => {
  if (schema === "bio") {
    const results = await api
      .post("/user/profile", formData, { withCredentials: true })
      .then((res) => res.data)
      .catch((error) => error.response.data);
    return results;
  }
  if (schema === "personal") {
    const results = await api
      .post("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((error) => error.response.data);
    return results;
  }
};

// Social Section
export const getUserSocials = async () => {
  const results = await api
    .get("/user/socials", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

export const updateUserSocials = async (formData: Object) => {
  const results = await api
    .post("/user/socials", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

// Change Password
export const changePassword = async (formData: Object) => {
  const results = await api
    .post("/user/changePassword", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

// Get and change security verse
export const getSecVerse = async () => {
  const results = await api
    .get("/user/securityVerse", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

export const updateSecVerse = async (formData: Object) => {
  const results = await api
    .post("/user/securityVerse", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

// Delete Account
export const deleteUserAccount = async () => {
  const results = await api
    .delete("/user/deleteAccount", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};
