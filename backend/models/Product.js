// Product.js (Mongoose Schema)
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // _id: String, // Giữ nguyên ID nếu cần
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    position: Number,
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Product = mongoose.model("Product", productSchema, "product");
module.exports = Product;
