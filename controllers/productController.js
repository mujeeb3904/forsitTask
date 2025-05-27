const Product = require("../models/productModel");
const Inventory = require("../models/inventoryModel");
const asyncHandler = require("express-async-handler");
const { uploadFiles } = require("../config/s3");

// universal image upload function
const upload = asyncHandler(async (req, res) => {
  const file = req.file;
  const uploadResponse = await s3.uploadFiles([file]);
  const image = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION_NAME}.amazonaws.com/${uploadResponse[0].Key}`;
  console.log(req.file, image);

  res.status(200).json({ image: image });
});

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sku, imageUrl, initialStock } =
      req.body;

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: "SKU already exists." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sku,
      imageUrl,
    });

    await Inventory.create({
      product: product._id,
      quantity: initialStock || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sku, imageUrl, isActive } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.sku = sku ?? product.sku;
    product.imageUrl = imageUrl ?? product.imageUrl;
    product.isActive = isActive ?? product.isActive;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isActive = false;
    await product.save();
    res.json({ message: "Product marked as inactive" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  upload,
};
