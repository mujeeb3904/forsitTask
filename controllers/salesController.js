const Sale = require("../models/saleModel");
const Inventory = require("../models/inventoryModel");
const InventoryHistory = require("../models/inventoryHistoryModel");

const createSale = async (req, res) => {
  try {
    const { items, customer, platform } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the sale" });
    }
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;

      const inventory = await Inventory.findOne({ product: item.product });
      if (inventory) {
        const previousQuantity = inventory.quantity;
        inventory.quantity = Math.max(0, inventory.quantity - item.quantity);
        await inventory.save();

        // creating inventory history record
        await InventoryHistory.create({
          product: item.product,
          previousQuantity,
          newQuantity: inventory.quantity,
          changeReason: "Sale",
          notes: `Sale deducted ${item.quantity} units`,
        });
      }
    }

    const sale = await Sale.create({
      items,
      totalAmount,
      customer,
      platform,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { startDate, endDate, product, category, platform } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (platform) query.platform = platform;

    let sales = await Sale.find(query)
      .populate({
        path: "items.product",
        select: "name sku price category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    // Filter by product or category
    if (product || category) {
      sales = sales.filter((sale) => {
        return sale.items.some((item) => {
          if (product && item.product._id.toString() === product) return true;
          if (category && item.product.category._id.toString() === category)
            return true;
          return false;
        });
      });
    }

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate({
      path: "items.product",
      select: "name sku price category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSaleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const sale = await Sale.findById(req.params.id);

    if (sale) {
      // If changing from completed to cancelled/refunded, also update inventory
      if (
        sale.status === "Completed" &&
        (status === "Cancelled" || status === "Refunded")
      ) {
        for (const item of sale.items) {
          const inventory = await Inventory.findOne({ product: item.product });
          if (inventory) {
            const previousQuantity = inventory.quantity;
            inventory.quantity += item.quantity;
            await inventory.save();

            // inventory history record
            await InventoryHistory.create({
              product: item.product,
              previousQuantity,
              newQuantity: inventory.quantity,
              changeReason: status === "Cancelled" ? "Cancellation" : "Return",
              notes: `${status} restored ${item.quantity} units to inventory`,
            });
          }
        }
      }

      sale.status = status;
      const updatedSale = await sale.save();

      res.json(updatedSale);
    } else {
      res.status(404).json({ message: "Sale not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSaleStatus,
};
