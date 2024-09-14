import { executeQuery } from "../handler/exeute.handler.js";
import { filterOne } from "../middlewares/filterCategory.middleware.js";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachFindQuery,
  attachUpdateQuery,
} from "../middlewares/query.middleware.js";
import { SubCategory } from "../Model/SubCategory.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(attachFindQuery(SubCategory),filterSubCategories(), executeQuery())
  .post(
    verifyTokenAndAdmin,
    // upload.array("images"),
    attachCategoryId(),
    attachAddQuery(SubCategory),
    executeQuery({ status: 201 })
  );
router
  .route("/:subCategorySlug")
  .get(
    attachCategoryId(),
    attachFindQuery(SubCategory),
    filterSubCategories(),
    // filterOne({ feildName: "slug", param: "subCategorySlug" }),
    executeQuery()
  )
  .put(
    attachUpdateQuery(SubCategory),
    attachCategoryId(),
    filterSubCategories(),
    executeQuery()
  )
  .delete(
    attachDeleteQuery(SubCategory),
    attachCategoryId(),
    filterSubCategories(),
    executeQuery()
  );
