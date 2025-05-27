const mongoose = require("mongoose");

const inventoryHistorySchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    changeReason: {
      type: String,
      enum: ["Sale", "Restock", "Adjustment", "Return", "Other"],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryHistory = mongoose.model("InventoryHistory", inventoryHistorySchema);

module.exports = InventoryHistory;