import { api } from "./base";

export const getNumOfVerses = async () => {
  const results = await api
    .get("/exam-mgmr/verses-info", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const getMockExams = async () => {
  const results = await api
    .get("/exam-mgmr/mock-exam", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const createMockExams = async (formdata: Object) => {
  const results = await api
    .post("/exam-mgmr/mock-exam", formdata, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const startMockExam = async (formdata: Object) => {
  const results = await api
    .post("/exam-mgmr/mock-exam", formdata, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const createOfficialExams = async () => {
  const results = await api
    .post("/exam-mgmr/official-exam", "hello", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const editMockExams = async (formdata: Object) => {
  const results = await api
    .put("/exam-mgmr/mock-exam", formdata, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};

export const deleteMockExams = async (examid: string) => {
  const results = await api
    .delete("/exam-mgmr/mock-exam", { data: { examid }, withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};
