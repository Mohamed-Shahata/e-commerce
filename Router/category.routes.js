import { executeQuery } from "../handler/exeute.handler.js";
import { filterOne } from "../middlewares/filterCategory.middleware.js";
import {
  attachAddQuery,
  attachDeleteQuery,
  attachFindQuery,
  attachUpdateQuery,
} from "../middlewares/query.middleware.js";
import { Category } from "../Model/Category.js";

const router = express.Router();

router
  .route("/")
  .get(attachFindQuery(Category), executeQuery())
  .post(
    verifyTokenAndAdmin,
    // upload.array("images"),
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
    attachUpdateQuery(Category),
    filterOne({ feildName: "slug", param: "categorySlug" }),
    executeQuery()
  )
  .delete(
    attachDeleteQuery(Category),
    filterOne({ feildName: "slug", param: "categorySlug" }),
    executeQuery()
  );
