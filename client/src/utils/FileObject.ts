import axios from "axios";
import { type ImageURL } from "./Types";

const blobToFile = (blob: Blob, fileName: string) => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export const defaultAvatar =
  "https://images.pexels.com/photos/2294878/pexels-photo-2294878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

export const fileObject = async (
  { fileUrl, fileName }: ImageURL = {
    fileUrl: defaultAvatar,
    fileName: "default.jpg",
    fileType: "image/jpeg",
  },
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
