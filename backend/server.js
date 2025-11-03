// backend/server.js (Routes Hoàn Chỉnh)
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path"; // <-- Cần import path
import { fileURLToPath } from "url"; // <-- Cần import cho ES Modules

// Xác định __dirname cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Controllers
import fs from "fs";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "./controllers/bannerController.js";
import { getLoggedInUserOrders } from "./controllers/orderController.js";
import {
  createOrder, // <-- HÀM MỚI
  deleteProduct,
  getOrders,
  getProductDetail,
  getProducts,
  productList,
  updateOrderStatus,
  updateProduct, // <-- HÀM MỚI
} from "./controllers/productController.js";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  getWishlist,
  loginUser,
  registerUser,
  updatePassword,
} from "./controllers/userController.js";
// Middleware
import { protect } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// --- CẤU HÌNH ---
const MONGO_URI = "mongodb://localhost:27017/app-computer";
const PORT = process.env.PORT || 5000;
const app = express();

// --- CẤU HÌNH MULTER ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1. Xây dựng đường dẫn tuyệt đối đến thư mục uploads
    const uploadPath = path.join(projectRoot, "uploads");

    // 2. KIỂM TRA VÀ TẠO THƯ MỤC NẾU CHƯA CÓ (Rất quan trọng trên Windows)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // <-- Sử dụng đường dẫn tuyệt đối
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// 🎯 PHỤC VỤ FILE TĨNH (CẦN ĐỂ ẢNH HIỂN THỊ)
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

// --- Kết nối MongoDB --- (Giữ nguyên)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB đã kết nối thành công!");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  }
};
connectDB();

// --- Định tuyến API (Routes) ---

// Routes KHÔNG cần xác thực (Giữ nguyên)
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.get("/api/products", getProducts);
app.get("/api/products/:id", getProductDetail);

// ROUTES TRANG CÁ NHÂN (YÊU CẦU TOKEN - Giữ nguyên)
app.get("/api/users/profile", protect, getUserProfile);
app.put("/api/users/password", protect, updatePassword);
app.get("/api/orders/myorders", protect, getLoggedInUserOrders);

// ------------------------------------------
// ROUTES ADMIN/QUẢN LÝ (ĐÃ GỠ 'protect')
// ------------------------------------------
app.post("/api/orders", protect, createOrder);
app.get("/api/orders", getOrders);
app.put("/api/orders/:id", updateOrderStatus);
app.post("/api/products", upload.single("image"), productList);
app.put("/api/products/:id", upload.single("image"), updateProduct); // <-- ROUTE SỬA SP MỚI
app.delete("/api/products/:id", deleteProduct); // <-- ROUTE XÓA SP MỚI
app.get("/api/users", getUsers);
app.delete("/api/users/:id", deleteUser);

app.get("/api/users/wishlist", protect, getWishlist);

// ... Trong phần Định tuyến API (Giữ nguyên Multer upload cho banner)
app.get("/api/banners", getBanners); // Lấy danh sách banner (Frontend App gọi)
app.post("/api/banners", upload.single("bannerImage"), createBanner); // Thêm banner mới (Admin gọi)
app.put("/api/banners/:id", upload.single("bannerImage"), updateBanner); // Sửa banner (Admin gọi)
app.delete("/api/banners/:id", deleteBanner); // Xóa banner (Admin gọi)

// --- Middleware Xử lý Lỗi (Giữ nguyên) ---
app.use(notFound);
app.use(errorHandler);

// --- Khởi động Server ---
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
