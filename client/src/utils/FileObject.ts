import axios from "axios";
import { defaultFileObj, type ImageURL } from "./Types";

const blobToFile = (blob: Blob, fileName: string) => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export const defaultAvatar =
  "https://res.cloudinary.com/dz6l4si8o/image/upload/v1749147924/Versed%20Avatars/default.jpg";

export const fileObject = async (
  { fileUrl, fileName }: ImageURL = defaultFileObj,
  clear: boolean = false
): Promise<FileList> => {
  const dataTransfer = new DataTransfer();
  if (clear) {
    dataTransfer.clearData();
  }

  // const blob = new Blob([fileUrl], { type: fileType });
  // const imageFileObject = new File([blob], fileName, { type: fileType });
  const results: Blob = await axios
    .get(fileUrl, { responseType: "blob" })
    .then((res) => res.data)
    .catch(() => false);
  // console.log(results);
  const imageFileObject: File = blobToFile(results, fileName);
  //   console.log(imageFileObject, "FILE");

  dataTransfer.items.add(imageFileObject);
  //   console.log("data", dataTransfer.files);
  return dataTransfer.files;
};

export const tooltipTheme = {
  pt: {
    text: {
      style: {
        color: "!bg-primary !text-primary-contrast !font-medium #e8f0ff",
        backgroundColor: "#702632",
        padding: ".5rem",
        borderRadius: ".5rem",
        fontSize: ".9rem",
      },
    },
  },
};
