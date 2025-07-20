import { Router } from "express"
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  upload,
  checkSkuExists
} from "../controllers/product.controller"

const router = Router()

router.post("/", upload.array("images"), createProduct)
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "replacements", maxCount: 10 },
  ]),
  updateProduct
);

router.get('/check-sku/:sku', checkSkuExists);
router.delete("/:id", deleteProduct)

export default router
