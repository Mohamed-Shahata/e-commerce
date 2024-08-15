const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req , file , cb) => {
    cb(null , path.join(__dirname , "../images"));
  },
  filename:(req , file , cb) => {
    cb(null , Date().toString().replace(/:/g , "-") + file.originalname)
  }
});

const upload = multer({ storage });

module.exports = upload;