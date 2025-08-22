import { api } from "./base";

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
  const results = await api
    .post("/verses/import-verses", formData, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err.response);
  return results;
};
