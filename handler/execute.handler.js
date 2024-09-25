import { imagesOnProduct } from "../Model/Images_Of_Product.js";
import { Product } from "../Model/Product.js";
import { catchAsyncError } from "../utils/error.handler.js";
import { makeImage } from "./execute.images.handler.js";

export const executeQuery = ({ status = 200 } = {}) => {
  return catchAsyncError(async (req, res, next) => {
    try {
      console.log("خراااا");
      
      // Await the dbQuery to get the response directly
      const response = await req.dbQuery;
      console.log("response", response);

      // Send the response back with the specified status
      res.status(status).json({ response });
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Error executing query" });
    }
  });
};

export const executeProductQuery = ({ status = 201 } = {}) => {
  return catchAsyncError(async (req, res, next) => {
    try {
    
    // create product
    const product = await req.dbQuery;

    // create images
    await Promise.all(
      req.files.images.map(async (file) => {
        // if a map() return a promise i can add await before it , why it this prefer
        try {
          // create images in public model for Image
          const imageDoc = await makeImage(file.path);
          // create in imagesOnProduct
          await imagesOnProduct.create({
            image_id: imageDoc._id,
            product_id: product._id,
          });
        } catch (error) {
          console.log(`Error on make images of product >> ${error}`);
          return next(error);
        }
      })
    );
    res.status(status).json({
      message: `Added product with ${req.files.images.length} images`,
    });
  }catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error executing query SSS:", err);
      return res.status(500).json({ message: "Error executing query" });
    }
  });
};

export const executeUpdatedProductQuery = ({ status = 201 } = {}) => {
  return catchAsyncError(async (req, res, next) => {
    try {
      // create product
      const product = await Product.findOne({
        slug: req.params.ProductSlug,
      });
      console.log("product      ", product);

      await Promise.all(
        // delete images of product according to imagesOnProduct
        product.images.map(async (image) => {
          try {
            // delete old image in imagesOnProduct
            await imagesOnProduct.findByIdAndDelete(image.image_id);
          } catch (error) {
            console.log(
              `Error on delete images of product before update >> ${error}`
            );
            return next(error);
          }
        })
      );
      // create new images to updated
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            // create images in public model for Image
            const imageDoc = await makeImage(file.path);
            // create in imagesOnProduct
            await imagesOnProduct.create({
              image_id: imageDoc._id,
              product_id: product._id,
            });
          } catch (error) {
            console.log(`Error on make images of product >> ${error}`);
            return next(error);
          }
        })
      );
      await req.dbQuery;
      res.status(status).json({
        message: `Added product with ${req.files.images.length} images`,
      });
    } catch (err) {
      // Handle potential errors from dbQuery
      console.error("Error executing query:", err);
      return res.status(500).json({ message: "Error executing query" });
    }
  });
};
