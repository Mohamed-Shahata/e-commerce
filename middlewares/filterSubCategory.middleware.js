import { Category } from "../Model/Category.js";
import { SubCategory } from "../Model/SubCategory.js";
import { catchAsyncError } from "../utils/error.handler.js";

// attach createdBy of any model in required routes
export const filtercreatedBy = () => {
  return catchAsyncError((req, res, next) => {
    // const { categorySlug } = req.params;
    // const category = await Category.findOne({ slug: categorySlug });
    // filter in subCategory model
    req.dbQuery = req.dbQuery.where({ createdBy: req.user._id });
    next();
  });
};

// attach CategoryId from Category slug in required routes
export const filterSubCategories = () => {
  return catchAsyncError(async (req, res, next) => {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    // filter in subCategory model

    req.dbQuery = req.dbQuery.where({ categoryId: category._id });

    next();
  });
};
// attach CategoryId from slug in add subcategory OR product routes
export const attachCategoryId = () => {
  return async (req, res, next) => {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    req.body.categoryId = category._id; // categoryId added to body to execute
    req.parent = category;
    console.log("req.parent111",req.parent);
    
    console.log("attachCategoryId ", req.body);

    next();
  };
};

// attach subCategoryId from slug in add product route
export const attachSubCategoryId = () => {
  return async (req, res, next) => {
    const { subCategorySlug } = req.params;
    const subCategory = await SubCategory.findOne({ slug: subCategorySlug });
    req.body.subCategoryId = subCategory._id;  


    console.log("attachCategoryId ", req.body);

    next();
  };
};
