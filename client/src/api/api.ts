import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();

export const api = wrapper(
  axios.create({ jar: jar, baseURL: "http://localhost:5000/api" })
);

export const checkAuth = async () => {
  const results = await api
    .get("/checkUser", {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

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
