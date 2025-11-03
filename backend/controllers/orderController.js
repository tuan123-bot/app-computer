// backend/controllers/orderController.js (TẠO MỚI)
import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js"; // Import Order Model

// @desc Lấy lịch sử đơn hàng của người dùng đang đăng nhập
const getLoggedInUserOrders = asyncHandler(async (req, res) => {
  // Tìm đơn hàng dựa trên ID người dùng được gắn vào req.user
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.json(orders);
});

export { getLoggedInUserOrders };
