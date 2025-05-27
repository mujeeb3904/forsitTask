const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/createCategory", categoryController.createCategory);
router.get("/AllCategories", categoryController.getCategories);
router.get("/category:id", categoryController.getCategoryById);
router.put("/updateCategory/:id", categoryController.updateCategory);
router.delete("/deleteCategory/:id", categoryController.deleteCategory);

module.exports = router;
