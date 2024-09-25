import { executeQuery } from "../handler/execute.handler.js";
import { attachImage } from "../middlewares/attachImage.middleware.js";
import {
  attachCategoryId,
  filterSubCategories,
} from "../middlewares/filterSubCategory.middleware.js";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachFindQuery,
  attachUpdateQuery,
} from "../middlewares/query.middleware.js";
import { upload } from "../middlewares/uploadImage.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { SubCategory } from "../Model/SubCategory.js";
import { Router } from "express";
import { productRouter } from "./product.routes.js";

const router = Router({ mergeParams: true });
/**
 * Route handling products under a specific subCategory.
 * Delegates requests to product router.
 * @route /:subCategorySlug/product
 */
router.use('/:subCategorySlug/product', productRouter);

router
  .route("/")
  .get(
    verifyToken(["admin"]),
    attachFindQuery(SubCategory),
    filterSubCategories(),
    executeQuery()
  )
  .post(
    verifyToken(["admin"]),
    upload.single("image"),
    attachImage("image"),
    attachCategoryId(),
    attachAddQuery(SubCategory),
    executeQuery({ status: 201 })
  );
router
  .route("/:subCategorySlug")
  .get(
    attachCategoryId(),
    filterSubCategories(),
    attachFindQuery(SubCategory),
    executeQuery()
  )
  .put(
    upload.single("image"),
    attachImage("image"),
    attachCategoryId(),
    filterSubCategories(),
    attachUpdateQuery(SubCategory),
    executeQuery()
  )
  .delete(
    attachCategoryId(),
    filterSubCategories(),
    attachDeleteQuery(SubCategory),
    executeQuery()
  );

export { router as subCategoryRouter };
