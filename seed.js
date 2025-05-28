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

    const sampleProducts = [
      {
        name: "Smartphone",
        price: 699,
        description: "Latest Android phone",
        category: categories["Electronics"],
        sku: generateSku("Smartphone"),
        imageUrl: "https://dummyimage.com/phone.jpg",
      },
      {
        name: "Novel Book",
        price: 19,
        description: "Best-selling fiction book",
        category: categories["Books"],
        sku: generateSku("Novel Book"),
        imageUrl: "https://dummyimage.com/book.jpg",
      },
      {
        name: "Gaming Laptop",
        price: 1499,
        description: "High-performance laptop for gaming",
        category: categories["Laptop"],
        sku: generateSku("Gaming Laptop"),
        imageUrl: "https://dummyimage.com/laptop.jpg",
      },
    ];

    const createdProducts = await Product.insertMany(sampleProducts);

    const inventoryEntries = createdProducts.map((product) => ({
      product: product._id,
      quantity: 100,
    }));

    await Inventory.insertMany(inventoryEntries);

    await Sale.create({
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
        },
      ],
      totalAmount: createdProducts[0].price,
      customer: "John Doe",
      platform: "Walmart",
      date: new Date(),
    });

    console.log(" Seed data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error(" Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
