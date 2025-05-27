const mongoose = require("mongoose");
const Sale = require("../models/saleModel");

// Helper function
const getDateRange = (period) => {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "daily":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "yearly":
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setHours(0, 0, 0, 0);
  }

  return { startDate, endDate: now };
};

const getRevenueSummary = async (req, res) => {
  try {
    const { period } = req.params;
    const { startDate, endDate } = getDateRange(period);

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "Completed",
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalSales = sales.length;

    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);

    switch (period) {
      case "daily":
        prevStartDate.setDate(prevStartDate.getDate() - 1);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevEndDate.setHours(23, 59, 59, 999);
        break;
      case "weekly":
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        break;
      case "monthly":
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        break;
      case "yearly":
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        break;
    }

    const prevSales = await Sale.find({
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
      status: "Completed",
    });

    const prevTotalRevenue = prevSales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );
    const prevTotalSales = prevSales.length;

    // Calculate growth
    const revenueGrowth =
      prevTotalRevenue === 0
        ? 100
        : ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100;

    const salesGrowth =
      prevTotalSales === 0
        ? 100
        : ((totalSales - prevTotalSales) / prevTotalSales) * 100;

    res.json({
      period,
      startDate,
      endDate,
      totalRevenue,
      totalSales,
      prevTotalRevenue,
      prevTotalSales,
      revenueGrowth,
      salesGrowth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const sales = await Sale.find({
      ...dateFilter,
      status: "Completed",
    }).populate({
      path: "items.product",
      select: "category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    const revenueByCategory = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (item.product && item.product.category) {
          const categoryId = item.product.category._id.toString();
          const categoryName = item.product.category.name;

          if (!revenueByCategory[categoryId]) {
            revenueByCategory[categoryId] = {
              _id: categoryId,
              name: categoryName,
              revenue: 0,
              salesCount: 0,
            };
          }

          revenueByCategory[categoryId].revenue += item.price * item.quantity;
          revenueByCategory[categoryId].salesCount += item.quantity;
        }
      });
    });

    res.json(Object.values(revenueByCategory));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueByPlatform = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const result = await Sale.aggregate([
      {
        $match: {
          ...dateFilter,
          status: "Completed",
        },
      },
      {
        $group: {
          _id: "$platform",
          revenue: { $sum: "$totalAmount" },
          salesCount: { $sum: 1 },
        },
      },
      {
        $project: {
          platform: "$_id",
          revenue: 1,
          salesCount: 1,
          _id: 0,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const result = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          salesCount: { $sum: 1 },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          revenue: 1,
          salesCount: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRevenueSummary,
  getRevenueByCategory,
  getRevenueByPlatform,
  getDailyRevenue,
};
