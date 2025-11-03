// backend/controllers/userController.js (PHIÊN BẢN HOÀN CHỈNH)

import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js"; // Đảm bảo đã có file này

// ------------------------------------------
// I. CÁC HÀM CŨ (Đã khôi phục logic và bọc asyncHandler)
// ------------------------------------------

// @desc Đăng ký người dùng mới (POST /api/register)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Vui lòng điền đầy đủ Tên, Email và Mật khẩu.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email này đã được đăng ký.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      success: true,
      msg: "Đăng ký thành công!",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu người dùng không hợp lệ");
  }
});

// @desc Đăng nhập người dùng (POST /api/login)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      msg: "Đăng nhập thành công!",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Thông tin đăng nhập không hợp lệ.");
  }
});

// @desc Lấy tất cả người dùng (GET /api/users)
const getUsers = asyncHandler(async (req, res) => {
  // 🎯 FIX LỖI LỌC: BỎ { deleted: false } để lấy tất cả người dùng MỚI
  // 🎯 FIX SELECT: Thêm trường 'isAdmin' để Frontend hiển thị đúng vai trò
  const users = await User.find({}).select(
    "_id name email registeredAt isAdmin" // <-- ĐÃ THÊM isAdmin
  );
  if (!users || users.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(users);
});

// @desc Xóa người dùng (DELETE /api/users/:id)
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await User.findByIdAndUpdate(
    userId,
    { deleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!result) {
    res.status(404);
    throw new Error("Người dùng không tồn tại hoặc đã bị xóa trước đó.");
  }

  res
    .status(200)
    .json({ success: true, msg: "Xóa mềm tài khoản người dùng thành công." });
});

// ------------------------------------------
// II. HÀM MỚI CHO PROFILE
// ------------------------------------------

// @desc Lấy Profile (GET /api/users/profile)
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "default_avatar.png", // Dữ liệu ảnh đại diện
    });
  } else {
    res.status(404);
    throw new Error("Người dùng không tìm thấy");
  }
});

// @desc Đổi Mật khẩu (PUT /api/users/password)
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { currentPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Mật khẩu hiện tại không chính xác");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Mật khẩu đã được cập nhật thành công" });
  } else {
    res.status(404);
    throw new Error("Người dùng không tồn tại");
  }
});
const getWishlist = asyncHandler(async (req, res) => {
  // 1. Lấy User ID từ token (đã được bảo vệ bởi middleware 'protect')
  const userId = req.user._id;

  // 2. Tìm người dùng và populate (điền đầy) danh sách yêu thích
  // Giả định User Model của bạn có trường 'wishlist' lưu [ObjectID của Sản phẩm]
  const user = await User.findById(userId)
    .select("wishlist")
    .populate("wishlist");

  if (!user) {
    res.status(404);
    throw new Error("Người dùng không tìm thấy.");
  }

  // 3. Trả về mảng các sản phẩm yêu thích
  // Nếu trường wishlist trong Model User của bạn tên là 'favorites', hãy sửa ở đây
  const wishlistProducts = user.wishlist || [];

  res.status(200).json(wishlistProducts);
});

export {
  deleteUser,
  getUserProfile,
  getUsers,
  getWishlist,
  loginUser,
  registerUser,
  updatePassword,
};
