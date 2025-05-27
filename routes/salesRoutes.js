const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

router.post("/productSold", salesController.createSale);
router.get("/getSales", salesController.getSales);
router.get("/saleByDetails/:id", salesController.getSaleById);
router.put("/updateSaleStatus/:id", salesController.updateSaleStatus);

module.exports = router;
