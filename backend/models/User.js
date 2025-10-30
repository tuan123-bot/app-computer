const mongoose = require("mongoose");

// Định nghĩa Schema cho người dùng
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    email: {
      type: String,
      required: true,
      unique: true, // Đảm bảo email là duy nhất
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Tự động thêm createdAt và updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);
