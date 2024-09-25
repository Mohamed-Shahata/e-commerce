import {
  executeProductQuery,
  executeQuery,
} from "../handler/execute.handler.js";
import {
  attachCoverImage,
  attachImage,
} from "../middlewares/attachImage.middleware.js";
import {
  fieldsQuery,
  filterOne,
  filterQuery,
  paginateQuery,
  searchQuery,
  sortQuery,
} from "../middlewares/features.middleware.js";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachFindQuery,
  attachUpdateQuery,
} from "../middlewares/query.middleware.js";
import { Product } from "../Model/Product.js";
import { upload } from "../middlewares/uploadImage.middleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Router } from "express";
import { attachCategoryId, attachSubCategoryId } from "../middlewares/filterSubCategory.middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    attachFindQuery(Product),
    paginateQuery({ pageLimit: 3 }),
    // populateQuery("subCategotyId", ["name"]),
    sortQuery(),
    fieldsQuery(),
    searchQuery(["name"]), // 
    filterQuery(), //
    executeQuery()
  )
  .post(
    verifyToken(["admin"]),
    upload.fields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    attachCoverImage("imgCover"),
    attachCategoryId(),
    attachSubCategoryId(),
    attachAddQuery(Product),
    executeProductQuery()
  );
router
  .route("/:ProductSlug")
  .get(
    attachFindQuery(Product),
    filterOne({ feildName: "slug", param: "ProductSlug" }),
    executeQuery()
  )
  .put(
    upload.single("imgCover"),
    attachImage("imgCover"),
    attachUpdateQuery(Product),
    filterOne({ feildName: "slug", param: "ProductSlug" }),
    executeQuery()
  )
  .delete(
    attachDeleteQuery(Product),
    filterOne({ feildName: "slug", param: "ProductSlug" }),
    executeQuery()
  );

export { router as productRouter };
