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
  console.log(form);
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

// User profile
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
