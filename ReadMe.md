• **System Workflow**

• **Categories:** First, you create product categories (like "Electronics", "Books").

• Products: Then, products are created under those categories. When a product is created, an inventory entry is automatically added.

• Inventory: Inventory shows how much stock is available. When products are sold or manually updated, the inventory changes.

• Sales: When a sale is made, it reduces the product quantity in inventory automatically.

• Revenue: Revenue is calculated based on completed sales and is used in reports.

• Project Structure

The project uses the MVC pattern:

• Models – Define your database structure (MongoDB using Mongoose).

• Controllers – Handle logic and data processing.

• Routes – Define the API URLs that users or frontend apps can call.

• Models
These define what data is stored in MongoDB:

• Category: Product categories

• Product: Product details (price, description, etc.)

• Inventory: Current stock of each product

• InventoryHistory: Keeps record of inventory changes

• Sale: Stores each sale (items sold, total amount, customer, etc.)

2. Controllers
   They contain logic to:

• Create/get/update/delete categories and products

• Automatically create inventory when a product is added

• Update inventory during a sale

• Track inventory changes in history

• Calculate revenue (total, by category, by platform, daily)

3. Routes
   These define your API endpoints like:

/categories/createCategory

/products/createProduct

/sales/productSold

/revenue/revenueByCategory

Each route calls the related controller function.

4. Entry Point (index.js)
   This is the main file and entery point for the app:
   Loads environment variables
   Connects to MongoDB
   Sets up Express server
   Mounts routes
   Starts listening on the port

5. Config
   database.js: Connects to MongoDB

s3.js: Upload/delete files from AWS S3 (used for product images)

• How to Run the Project
Clone the repository
git clone https://github.com/mujeeb3904/forsitTask.git
Install dependencies
npm install

Add .env file with this:
• MONGO_URI=your_mongodb_uri
• PORT=5000
• REGION_NAME=your_aws_region
• ACCESS_KEY_ID=your_aws_access_key
• SECRET_ACCESS_KEY=your_aws_secret
• BUCKET_NAME=your_s3_bucket

• npm start
• Summary
This project handles categories, products, inventory, sales, and revenue tracking using Node.js, Express, MongoDB (Mongoose), and AWS S3. It follows an MVC structure for clean code separation and scalability.
