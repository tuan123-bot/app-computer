// backend/models/User.js (THAY THẾ TOÀN BỘ)
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Lưu tham chiếu đến Model Product
      },
    ],
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    avatar: { type: String, default: "default_avatar.png" }, // BỔ SUNG TRƯỜNG AVATAR
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
