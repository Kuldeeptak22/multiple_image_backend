import multer from "multer";
import fs from "fs";
import path from "path";

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // now we validate that "uploads" folder exist or not
    if (fs.existsSync("uploads" + req.baseUrl)) {
      cb(null, "uploads" + req.baseUrl);
    } else {
      fs.mkdirSync("uploads" + req.baseUrl);
      cb(null, "uploads" + req.baseUrl);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const orgName = file.originalname;
    const imgArr = orgName.split(".");
    imgArr.pop();
    const fname = imgArr.join(".");
    const extention = path.extname(orgName);
    const generatedFilename = fname + "_" + uniqueSuffix + extention;
    cb(null, generatedFilename);
  },
});

//   fileFilter: function (req, file, cb) {
//     const allowedExtensions = [".jpg", ".jpeg", ".png"];
//     const extname = path.extname(file.originalname).toLowerCase();

//     if (allowedExtensions.includes(extname)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
//     }
//   },
