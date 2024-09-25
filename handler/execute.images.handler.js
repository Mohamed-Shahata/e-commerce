import { image } from "../Model/Image.js";
import { uploadImage, uploadImages } from "../utils/cloudinary.Images.js";

export const makeImage = async (path) => {
  try {
    // create image in cloudinary
    const { imageName, imageUrl } = await uploadImage(path);
    console.log("Image uploaded:", imageName, imageUrl);

    const i = await image.create({
      name: imageName,
      path: imageUrl,
    });
    console.log("Image document created:", i);

    return i;
  } catch (error) {
    console.error("Error in makeImage:", error);
    throw error; // Rethrow the error for further handling
  }
};

// export const makeImages= async (path) => {
//   const { imageName, imageUrl } = await uploadImages(path);

//   return await Image.create({ // is this
//     name: imageName,
//     path: imageUrl,
//   });
// };
