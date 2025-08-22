import { api } from "./base";

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
