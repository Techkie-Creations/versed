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
