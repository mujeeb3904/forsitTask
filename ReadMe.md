** Tech Stack Overview**

**Runtime & Framework:** Node.js with Express.js

**Database:** MongoDB (NoSQL) using Mongoose ODM

**Storage:** AWS S3 for product image upload & management

**Environment:** dotenv for configuration, nodemon for dev server

**API Format:** RESTful JSON

**Testing Tool:** Postman

**System Flow & Architecture**

This API supports an admin panel for managing an e-commerce backend. It handles:

**Categories:** Logical grouping of products.

**Products:** Includes price, description, image, and stock.

**Inventory:** Tracks stock levels and logs changes.

**Sales:** Captures sale events, updates inventory.

**Revenue:** Analyzes and aggregates income data.

The project uses the MVC Pattern for structure:

**Model:** Database schemas and rules.

**Controller:** Business logic for requests.

**Routes:** API endpoints linked to controller functions.

Folder Structure Overview

/models – MongoDB schemas (Category, Product, Inventory, InventoryHistory, Sale)

/controllers – Functions to manage CRUD, inventory sync, and revenue analytics

/routes – Endpoint definitions per module

/config – Database and AWS S3 configurations

index.js – Entry point: env setup, DB connect, route mount, server init



**Route Descriptions & Purpose**

**Category Routes**

POST /categories/createCategory – Create a new product category

GET /categories/AllCategories – Fetch all existing categories

PUT /categories/updateCategory/:id – Update a category by ID

DELETE /categories/deleteCategory/:id – Remove a category by ID

**Product Routes**

POST /products/createProduct – Add a new product to a category (auto-generates inventory)

GET /products/AllProducts – List all products

GET /products/product/:id – Fetch product details by ID

PUT /products/updateProduct/:id – Update a product’s info by ID

DELETE /products/deleteProduct/:id – Delete a product and associated inventory

**Inventory Routes**

GET /inventory/getInventory – List current inventory across all products

PUT /inventory/updateInventoryList/:id – Manually update inventory quantity for a product

GET /inventory/lowStockItems – Identify products running low on stock

GET /inventory/getInventoryHistory/:id – Show historical inventory changes for a product

**Sales & Revenue Routes**

POST /sales/productSold – Register a sale and reduce inventory accordingly

GET /sales/getSales – View all sales transactions

GET /sales/saleByDetails/:id – View detailed info for a specific sale

GET /revenue/revenueSummary – Aggregate total revenue

GET /revenue/revenueByCategory – Revenue breakdown by product category

GET /revenue/revenueByPlatform – Revenue split by sales platform (e.g., online, retail)

GET /revenue/DailyRevenue – Revenue tracked per day


**Conclusion**

This backend system offers robust capabilities for managing e-commerce workflows through a clean RESTful API. It uses a modular MVC approach, automates inventory handling, provides sale-based analytics, and integrates with AWS for image storage. Built with scalability and developer clarity in mind.
