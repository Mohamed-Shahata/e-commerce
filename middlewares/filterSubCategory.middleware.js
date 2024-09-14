import { Category } from "../Model/Category.js";
import { catchAsyncError } from "../utils/error.handler.js";

// attach CategoryId from Category slug in required routes
export const filterSubCategories = () => {
  return catchAsyncError(async (req, res, next) => {
    // const { categorySlug } = req.params;
    // const category = await Category.findOne({ slug: categorySlug });
    // filter in subCategory model
    req.dbQuery = req.dbQuery.where({ categoryId: parent._id }); // .populate()
    next();
  });
};
// attach CategoryId from slug in add subcategory route
export const attachCategoryId = () => {
  return async (req, res, next) => {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug }); // .populate()
    req.body.categoryId = category._id;
    req.parent = category
    next()
  };
};
