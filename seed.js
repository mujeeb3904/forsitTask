require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const Category = require("./models/categoryModel");
const Product = require("./models/productModel");
const Inventory = require("./models/inventoryModel");
const Sale = require("./models/saleModel");

const seedData = async () => {
  await connectDB();

  try {
    // Optional cleanup
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    // await Inventory.deleteMany({});
    // await Sale.deleteMany({});

    const categoryNames = [
      "Electronics",
      "Books",
      "Clothing",
      "Furniture",
      "Sports",
      "Toys",
      "Grocery",
      "Health",
      "Automotive",
      "Home",
      "Beauty",
      "Music",
      "Movies",
      "Outdoors",
      "Home Improvement",
      "Garden",
      "Pet Supplies",
      "Jewelry",
      "Keyboard",
      "Mouse",
      "Monitor",
      "Laptop",
      "Desktop",
      "Tablet",
      "Headphones",
      "Speaker",
      "Camera",
      "Printer",
      "Scanner",
      "Router",
      "Switch",
      "Hub",
      "Accessory",
      "Wireless",
      "Bluetooth",
      "Wire",
      "Power Supply",
      "Charger",
      "Mouse Pad",
      "Keyboard Cover",
      "Mouse Mat",
      "Keyboard Cable",
      "Mouse Cable",
      "AC",
      "TV",
      "Fridge",
      "Washing Machine",
      "Dishwasher",
      "Air Conditioner",
      "Television",
    ];

    const categories = {};
    for (const name of categoryNames) {
      let category = await Category.findOne({ name });
      if (!category) {
        category = await Category.create({ name });
      }
      categories[name] = category._id;
    }

    const generateSku = (productName) =>
      `SKU-${productName.toUpperCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const sampleProducts = [];
    for (let i = 1; i <= 20; i++) {
      const name = `Product ${i}`;
      const categoryName = categoryNames[i % categoryNames.length];
      sampleProducts.push({
        name,
        price: Math.floor(Math.random() * 500) + 50,
        description: `Description for ${name}`,
        category: categories[categoryName],
        sku: generateSku(name),
        imageUrl: `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(
          name
        )}`,
      });
    }
    const createdProducts = await Product.insertMany(sampleProducts);

    const inventoryEntries = createdProducts.map((product) => ({
      product: product._id,
      quantity: Math.floor(Math.random() * 100) + 10,
    }));

    await Inventory.insertMany(inventoryEntries);

    for (let i = 0; i < 10; i++) {
      const product = createdProducts[i];
      const quantity = Math.ceil(Math.random() * 3);

      // Updating inventory
      await Inventory.updateOne(
        { product: product._id },
        { $inc: { quantity: -quantity } }
      );

      await Sale.create({
        items: [
          {
            product: product._id,
            quantity,
            price: product.price,
          },
        ],
        totalAmount: quantity * product.price,
        customer: `Customer ${i + 1}`,
        platform: i % 2 === 0 ? "Amazon" : "Walmart",
        date: new Date(),
      });
    }

    console.log("Seed data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
