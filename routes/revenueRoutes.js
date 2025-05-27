const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenueController");

router.get("/revenueSummary", revenueController.getRevenueSummary);
router.get("/revenueByCategory", revenueController.getRevenueByCategory);
router.get("/revenueByPlatform", revenueController.getRevenueByPlatform);
router.get("/dailyRevenue", revenueController.getDailyRevenue);

module.exports = router;
