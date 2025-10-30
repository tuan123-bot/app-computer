const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controllers/userController");
const productController = require("./controllers/productController");

// --- CẤU HÌNH DATABASE ---
// THAY THẾ CHUỖI NÀY BẰNG CHUỖI KẾT NỐI MONGODB CỦA BẠN!
const MONGO_URI = "mongodb://localhost:27017/app-computer";

// ĐÃ CHUYỂN SANG CỔNG 5001 ĐỂ TRÁNH XUNG ĐỘT (Lỗi JSON Parse)
const PORT = process.env.PORT || 5000;

// Khởi tạo App
const app = express();

// --- Middleware ---
// Cấu hình CORS để cho phép mọi nguồn truy cập (Quan trọng cho React Native/Web)
app.use(
  cors({
    origin: "*", // Cho phép mọi domain truy cập
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ req.body

// --- Kết nối MongoDB ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB đã kết nối thành công!");
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err.message);
    process.exit(1); // Thoát ứng dụng nếu kết nối lỗi
  }
};

// Gọi hàm kết nối database
connectDB();

// --- Định tuyến API (Routes) ---

// API Đăng ký (Client App gọi)
app.post("/api/register", userController.registerUser);

// API Đăng nhập (Client App gọi)
app.post("/api/login", userController.loginUser); // <-- Route Đăng nhập MỚI

// API Lấy danh sách người dùng (Admin Dashboard gọi)
app.get("/api/users", userController.getUsers);

app.delete("/api/users/:id", userController.deleteUser);

app.get("/api/products", productController.getProducts);

app.post("/api/products", productController.productList);

app.get("/api/products/:id", productController.getProductDetail);

// --- Khởi động Server ---
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
