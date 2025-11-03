// backend/models/Banner.js (Tạo file này)

import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    image: {
      type: String, // Đường dẫn ảnh (sẽ được lưu bởi Multer)
      required: true,
    },
    link: {
      type: String, // Link khi người dùng bấm vào (ví dụ: /products/123)
      default: "/",
    },
    position: {
      type: Number, // Vị trí sắp xếp (dùng để trượt)
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("Banner", BannerSchema);
export default Banner;
