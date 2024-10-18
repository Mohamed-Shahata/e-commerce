import { Router } from "express";
import {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../Controllers/userController.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAutherization,
} from "../middlewares/verifyToken.js";

const router = Router();
import { upload } from "../middlewares/uploadImage.js";

// /api/users
router.get("/", verifyTokenAndAdmin, getAllUser);

// /api/users/id
router
  .route("/:id")
  .get(verifyToken, getSingleUser)
  .patch(verifyTokenAndAutherization, upload.single("image"), updateUser)
  .delete(verifyTokenAndAutherization, deleteUser);

export default router;
