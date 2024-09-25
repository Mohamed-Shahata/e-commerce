import cloudinary from "../config/cloudinary.js";

export const uploadImages = async (paths) => {
  try {
    const uploadResults = [];

    // Loop through all files in paths array
    for (const file of paths) {
      const result = await cloudinary.uploader.upload_chunked(file.path, {
        resource_type: "image",
      });

      const { public_id: imageName, secure_url: imageUrl } = result;
      uploadResults.push({ imageName, imageUrl });
    }

    console.log("All uploads successful:", uploadResults);
    return { uploadResults };
  } catch (error) {
    console.log("Upload failed:", error);
  }
};

export const uploadImage =async (path) => {
  const { public_id: imageName, secure_url: imageUrl } =
    await cloudinary.uploader.upload(path);

  return { imageName, imageUrl };
};

export const deleteImage =async (imageName) => {
  await cloudinary.uploader.destroy(imageName);
};
