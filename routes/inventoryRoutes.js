const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/getInventory", inventoryController.getInventory);
router.get("/lowStockItems", inventoryController.getLowStockItems);
router.put("/updateInventoryList/:id", inventoryController.updateInventory);
router.get("/getInventoryHistory/:id", inventoryController.getInventoryHistory);

module.exports = router;
