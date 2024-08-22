const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: "uploads",
    public_id: (req , file) => `${Date.now()}-${file.originalname.split(".")[0]}`
  }
})

const upload = multer({ storage })
module.exports = upload;