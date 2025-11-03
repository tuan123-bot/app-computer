// backend/middleware/authMiddleware.js
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import User Model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra Header Authorization: 'Bearer <token>'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ⚠️ THAY THẾ KHÓA BÍ MẬT!
      const decoded = jwt.verify(token, "YOUR_JWT_SECRET");

      // Gắn thông tin người dùng vào request
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Token lỗi:", error);
      res.status(401);
      throw new Error(
        "Không được phép truy cập, token không hợp lệ hoặc hết hạn"
      );
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Không được phép truy cập, thiếu token");
  }
});

export { protect };
