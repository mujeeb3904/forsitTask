const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/upload", productController.upload);
router.post("/createProduct", productController.createProduct);
router.get("/AllProducts", productController.getProducts);
router.get("/product/:id", productController.getProductById);
router.put("/updateProduct/:id", productController.updateProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
