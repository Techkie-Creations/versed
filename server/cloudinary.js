import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (buffer, mimetype) => {
  const b64 = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${mimetype};base64,${b64}`;
  const clouded = await cloudinary.uploader.upload(dataURI, {
    folder: "Versed Avatars",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
  return [clouded.secure_url, clouded.public_id];
};

export const deleteImage = async (publicId) => {
  console.log("HIT");
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.log("IMAGE DESTROY", error);
    return false;
  }
};
