import { makeImage } from "../handler/execute.images.handler.js";
import { catchAsyncError } from "../utils/error.handler.js";

export const attachImage = (bodyFieldName) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.file) return next();
    const imageDoc = await makeImage(req.file.path);
console.log("imageDoc",imageDoc);

    req.body[bodyFieldName] = imageDoc._id; // make image field in all models & ref to this id
    console.log("req.body",req.body);
    
    next();
  });

export const attachCoverImage = (bodyFieldName) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.files || !req.files[bodyFieldName] || req.files[bodyFieldName][0])
      return next();
    const imageDoc = await makeImage(req.files[bodyFieldName][0].path);

    req.body[bodyFieldName] = imageDoc._id;
    next();
  });
