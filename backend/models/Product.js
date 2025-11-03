// backend/models/Product.js (CẬP NHẬT)
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "product");

// ✅ PHẢI CÓ: Export Default để Controller có thể dùng 'import Product from...'
export default Product;
