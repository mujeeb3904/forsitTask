const mongoose = require("mongoose");

const saleItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const saleSchema = mongoose.Schema(
  {
    items: [saleItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    customer: {
      name: { type: String },
      email: { type: String },
    },
    platform: {
      type: String,
      enum: ["Amazon", "Walmart", "Direct", "Other"],
      default: "Direct",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Refunded"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;