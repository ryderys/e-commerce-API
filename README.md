# 🛍️ E-Commerce Backend API

A robust Node.js backend API for an e-commerce platform featuring Role-Based Access Control (RBAC), JWT authentication, and comprehensive product/cart management system.

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [usage](#-usage)
- [API Documentation](#-api-documentation)

## 🚀 Features
- **User Authentication** with JWT & Refresh Tokens
- **Role-Based Access Control** (Admin, Seller, Customer)
- Product Management (CRUD operations)
- Product Categroy,Features, Bookmarks
- Shopping Cart System
- Order Processing Workflow
- Review/Rating System
- Transaction History
- Swagger API Documentation

## 💻 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, bcrypt
- **API Docs**: Swagger/OpenAPI
- **Validation**: Joi

## 🛠️ Installation
1. Clone repository:
   ```sh
   git clone https://github.com/your-username/ecommerce-api.git
   cd ecommerce-api
   ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Configure environment variables (create .env file):
   ```env
      PORT=3000
      BASE_URL=http://localhost
      MONGO_URI="mongodb://127.0.0.1:27017/e-commerceAPI"
      MONGO_SEED_URI="mongodb://127.0.0.1:27017/e-commerce-seed"
      NODE_ENV="development"
      REFRESH_TOKEN_SECRET="someverysecretrefreshtoken"
      ACCESS_TOKEN_SECRET="someverysecretaccesstoken"
      JWT_SECRET_KEY="averysecretJWTtoken"
   ```
4. Seed initial data (roles/permissions/admin user):
    ```sh
      node seed:rbac
      ```
5. Start server:
     ```
       npm run start
     ```
    ## USAGE
      once the app is running, you can interact with the following endpoints:
      - **User Authentication**: Sign up, log in, and refresh tokens using JWT.
      - **Product Management**: Admin users can add, update, and delete products.
      - **Product Features**: Admin users can add, update, and delete features of a specific product.
      - **Product Category**: Admin users can add, update, and delete categories of a specific product.
      - **Shopping Cart**: Customers can add products to their shopping cart.
      - **Order Processing**: Customers can place orders and track their status.
      - **Reviews**: Customers can leave reviews and ratings for products.
      - **Transaction History**: View past transactions in your account.
      - **Wallet Functionality**: Manage your wallet balance for transactions.
        
  📧 Contact
      Ashkan youssefi - youssefi.ashkan.ys@gmail.com
   







   
