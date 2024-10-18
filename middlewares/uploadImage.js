
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: "uploads",
    public_id: (req , file) => `${Date.now()}-${file.originalname.split(".")[0]}`
  }
})

const upload = multer({ storage })
export {upload};