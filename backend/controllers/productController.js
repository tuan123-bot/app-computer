// backend/controllers/productController.js (ĐÃ HOÀN THIỆN LOGIC)

import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import Product from "../models/Product.js";

// ------------------------------------------
// LẤY DANH SÁCH SẢN PHẨM (GET /api/products)
// ------------------------------------------
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ deleted: false, status: "active" })
    .select("title description price thumbnail image _id stock") // Đã thêm 'stock'
    .limit(20)
    .sort({ position: 1 });
  res.status(200).json(products);
});

// ------------------------------------------
// THÊM SẢN PHẨM MỚI (POST /api/products)
// ------------------------------------------
const productList = asyncHandler(async (req, res) => {
  const newProductData = req.body;
  const imageFile = req.file;

  if (!newProductData.title || newProductData.price === undefined) {
    res.status(400);
    throw new Error("Thiếu trường 'title' hoặc 'price' bắt buộc.");
  }

  let imageUrl = "";
  if (imageFile) {
    imageUrl = `/uploads/${imageFile.filename}`;
  }

  const productToSave = {
    ...newProductData,
    status: "active",
    deleted: false,
    thumbnail: imageUrl,
    image: imageUrl,
  };
  const newProduct = new Product(productToSave);
  const savedProduct = await newProduct.save();

  res.status(201).json({
    status: "success",
    message: "Thêm sản phẩm thành công!",
    data: savedProduct,
  });
});

// ------------------------------------------
// CẬP NHẬT SẢN PHẨM (PUT /api/products/:id)
// ------------------------------------------
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;
  const imageFile = req.file;

  if (imageFile) {
    updateData.thumbnail = `/uploads/${imageFile.filename}`;
    updateData.image = `/uploads/${imageFile.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("title description price stock thumbnail image _id"); // Đã đồng bộ 'stock'

  if (!updatedProduct) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm cần cập nhật.");
  }

  res.status(200).json({
    status: "success",
    message: "Cập nhật sản phẩm thành công!",
    data: updatedProduct,
  });
});

// ------------------------------------------
// XÓA SẢN PHẨM (DELETE /api/products/:id)
// ------------------------------------------
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    { deleted: true, status: "inactive" },
    { new: true }
  );
  if (!deletedProduct) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm cần xóa.");
  }
  res.status(200).json({
    message: "Xóa sản phẩm thành công (Đã chuyển trạng thái)",
    id: productId,
  });
});

// ------------------------------------------
// LẤY CHI TIẾT SP (GET /api/products/:id)
// ------------------------------------------
const getProductDetail = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findOne({
    _id: productId,
    deleted: false,
  }).select("title description price discountPercentage thumbnail stock");
  if (!product) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm.");
  }
  res.status(200).json(product);
});

// ------------------------------------------
// TẠO ĐƠN HÀNG (POST /api/orders) - ĐÃ THÊM LOGIC KHO
// ------------------------------------------
const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    items, // Mảng sản phẩm (có price và qty)
    userId,
  } = req.body;

  if (!customerName || !items || items.length === 0) {
    res.status(400);
    throw new Error(
      "Dữ liệu đơn hàng không hợp lệ: Thiếu thông tin khách hàng hoặc sản phẩm."
    );
  }

  const calculatedTotalAmount = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const orderUserId =
    req.user?._id || req.body.userId || "60c72b2f9f1b4c3e8c9b2f2f";

  if (calculatedTotalAmount <= 0) {
    res.status(400);
    throw new Error("Tổng tiền đơn hàng không hợp lệ.");
  }

  // 🎯 BƯỚC 1: KIỂM TRA KHO TRƯỚC KHI TẠO
  const productTitles = items.map((item) => item.title);
  const dbProducts = await Product.find({ title: { $in: productTitles } });

  for (const item of items) {
    const dbProduct = dbProducts.find((p) => p.title === item.title);
    const requestedQty = item.qty || 1;

    if (!dbProduct || dbProduct.stock < requestedQty) {
      res.status(400);
      const availableStock = dbProduct ? dbProduct.stock : 0;
      throw new Error(
        `Sản phẩm '${item.title}' chỉ còn ${availableStock} sản phẩm. Không đủ ${requestedQty}.`
      );
    }
  }

  // 🎯 BƯỚC 2: TẠO VÀ LƯU ĐƠN HÀNG
  const newOrder = new Order({
    user: orderUserId,
    customerName,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    items,
    totalAmount: calculatedTotalAmount,
  });

  const savedOrder = await newOrder.save();

  // 🎯 BƯỚC 3: GIẢM SỐ LƯỢNG KHO TRONG DB
  for (const item of items) {
    const requestedQty = item.qty || 1;

    await Product.findOneAndUpdate(
      { title: item.title },
      { $inc: { stock: -requestedQty } },
      { new: true }
    );
  }

  res.status(201).json({
    status: "success",
    message: "Đơn hàng đã được tạo và kho đã được cập nhật!",
    order: savedOrder,
  });
});

// --- LẤY VÀ CẬP NHẬT ĐƠN HÀNG ---
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (
    !status ||
    !["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].includes(
      status
    )
  ) {
    res.status(400);
    throw new Error("Trạng thái cập nhật không hợp lệ.");
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: status },
    { new: true, runValidators: true }
  );
  if (!updatedOrder) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng cần cập nhật.");
  }
  res.status(200).json({
    status: "success",
    message: `Đơn hàng ${id} đã được cập nhật trạng thái thành ${status}.`,
    order: updatedOrder,
  });
});

// --- EXPORT CÁC HÀM ---
export {
  createOrder,
  deleteProduct,
  getOrders,
  getProductDetail,
  getProducts,
  productList,
  updateOrderStatus,
  updateProduct,
};
