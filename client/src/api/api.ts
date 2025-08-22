import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();

export const api = wrapper(
  axios.create({ jar: jar, baseURL: "http://localhost:5000/api" })
);

// Check user is signed in
export const checkAuth = async () => {
  const results = await api
    .get("/checkUser", {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

// User account creation and login and logout
export const registerUser = async (form: FormData) => {
  const results = await api
    .post("/auth/register", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
  return results;
};

export const loginUser = async (form: { email: string; password: string }) => {
  const results = await api
    .post("/auth/login", form, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

export const forgotPassword = async (formData) => {
  const results = await api
    .post("/auth/forgotPassword", formData, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

export const logout = async () => {
  const results = await api
    .post("/auth/logout", null, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
  return results;
};

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

/* VERSES */
// Get Verses
export const getVerses = async () => {
  const results = await api
    .get("/verses/my-verses", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const saveVerses = async (formData: Object) => {
  const results = await api
    .post("/verses/my-verses", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const deleteVerses = async () => {
  const results = await api
    .delete("/verses/my-verses", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

// Verse Security
export const getVerseSec = async () => {
  const results = await api
    .get("/verses/verse-sec", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const updateVerseSec = async (formData: Object) => {
  const results = await api
    .post("/verses/verse-sec", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

// Import Verses
export const versesImport = async (formData: Object) => {
  console.log("HIT");
  const results = await api
    .post("/verses/import-verses", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};
