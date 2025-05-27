const Inventory = require("../models/inventoryModel");
const InventoryHistory = require("../models/inventoryHistoryModel");
const Product = require("../models/productModel");

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({}).populate({
      path: "product",
      select: "name sku price category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStockItems = async (req, res) => {
  try {
    const inventory = await Inventory.find({}).populate({
      path: "product",
      select: "name sku price category",
      populate: {
        path: "category",
        select: "name",
      },
    });

    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.lowStockThreshold
    );

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { quantity, lowStockThreshold, reason, notes } = req.body;

    const inventory = await Inventory.findById(req.params.id);

    if (inventory) {
      const previousQuantity = inventory.quantity;

      if (quantity !== undefined) inventory.quantity = quantity;
      if (lowStockThreshold !== undefined)
        inventory.lowStockThreshold = lowStockThreshold;

      if (quantity !== undefined && quantity !== previousQuantity) {
        inventory.lastRestocked = Date.now();

        // Create inventory history
        await InventoryHistory.create({
          product: inventory.product,
          previousQuantity,
          newQuantity: quantity,
          changeReason: reason || "Adjustment",
          notes:
            notes || `Quantity updated from ${previousQuantity} to ${quantity}`,
        });
      }

      const updatedInventory = await inventory.save();
      res.json(updatedInventory);
    } else {
      res.status(404).json({ message: "Inventory not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryHistory.find({
      product: req.params.productId,
    })
      .sort({ createdAt: -1 })
      .populate("product", "name sku");

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventory,
  getLowStockItems,
  updateInventory,
  getInventoryHistory,
};
