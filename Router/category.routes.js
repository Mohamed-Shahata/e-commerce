import { executeQuery } from "../handler/execute.handler.js";
import { attachImage } from "../middlewares/attachImage.middleware.js";
import { filterOne } from "../middlewares/features.middleware.js";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachFindQuery,
  attachUpdateQuery,
} from "../middlewares/query.middleware.js";
import { upload } from "../middlewares/uploadImage.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Category } from "../Model/Category.js";
import { Router } from "express";
import { subCategoryRouter } from "./SubCategory..routes.js";

const router = Router();

router.use('/:categorySlug/sub-category',subCategoryRouter)

router
  .route("/")
  .get(
    verifyToken(["admin"]),
    attachFindQuery(Category),

    executeQuery()
  )
  .post(
    verifyToken(["admin"]),
    // upload.array("images"),
    upload.single("image"),
    attachImage("image"),
    //  createProduct
    attachAddQuery(Category),
    executeQuery({ status: 201 })
  );
router
  .route("/:categorySlug")
  .get(
    attachFindQuery(Category),
    filterOne({ feildName: "slug", param: "categorySlug" }),
    executeQuery()
  )
  .put(
    upload.single("image"),
    attachImage("image"),
    attachUpdateQuery(Category),
    filterOne({ feildName: "slug", param: "categorySlug" }),
    executeQuery()
  )
  .delete(
    attachDeleteQuery(Category),
    filterOne({ feildName: "slug", param: "categorySlug" }),
    executeQuery()
  );

export { router as categoryRouter };
