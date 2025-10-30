const User = require("../models/User"); // Import Mongoose Model
const bcrypt = require("bcryptjs"); // Thư viện mã hóa mật khẩu
// const jwt = require("jsonwebtoken"); // Sẽ dùng cho bước JWT tiếp theo

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Kiểm tra đầu vào
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Vui lòng điền đầy đủ Tên, Email và Mật khẩu." });
    }

    // 2. Kiểm tra Email đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Email này đã được đăng ký." });
    }

    // 3. Tạo 'Salt' và Mã hóa Mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Tạo Người dùng mới với mật khẩu đã mã hóa
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Lưu vào cơ sở dữ liệu
    await user.save();

    // 6. Trả lời thành công
    res.status(201).json({
      success: true,
      msg: "Đăng ký thành công! Dữ liệu đã được lưu trữ.",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err.message);
    res.status(500).json({ msg: "Lỗi Server nội bộ." });
  }
};

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !password) {
    return res.status(400).json({ msg: "Vui lòng nhập Email và Password." });
  }

  try {
    // 1. Tìm người dùng bằng email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Thông tin đăng nhập không hợp lệ." });
    }

    // 2. So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Thông tin đăng nhập không hợp lệ." });
    }

    // 3. Đăng nhập thành công
    // TODO: Bổ sung logic tạo và trả về JWT Token tại đây
    res.status(200).json({
      msg: "Đăng nhập thành công!",
      // token: [JWT_TOKEN_HERE],
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err.message);
    res.status(500).json({ msg: "Lỗi Server." });
  }
};

/**
 * @desc    Lấy tất cả người dùng (dành cho Admin Dashboard)
 * @route   GET /api/users
 * @access  Public
 */
const getUsers = async (req, res) => {
  try {
    // 🚨 ĐÃ SỬA: CHỈ LẤY NGƯỜI DÙNG CHƯA BỊ XÓA (deleted: false)
    const users = await User.find({ deleted: false }).select(
      "_id name email registeredAt"
    );

    // Trả về mảng người dùng trực tiếp
    res.status(200).json(users);
  } catch (err) {
    console.error("Lỗi lấy dữ liệu người dùng:", err.message);
    res.status(500).json({ msg: "Lỗi Server khi tải dữ liệu." });
  }
};

/**
 * @desc    Xóa người dùng (Soft Delete)
 * @route   DELETE /api/users/:id
 * @access  Admin/Private
 */
const deleteUser = async (req, res) => {
  try {
    // Lấy ID người dùng từ tham số URL
    const userId = req.params.id;

    // 🚨 ĐÃ SỬA: Sử dụng findByIdAndUpdate để thực hiện XÓA MỀM (Soft Delete)
    const result = await User.findByIdAndUpdate(
      userId,
      { deleted: true, deletedAt: new Date() }, // Thiết lập cờ xóa và thời gian xóa
      { new: true } // Trả về tài liệu đã cập nhật
    );

    // 2. Kiểm tra nếu không tìm thấy người dùng
    if (!result) {
      return res.status(404).json({
        msg: "Người dùng không tồn tại hoặc đã bị xóa trước đó.",
      });
    }

    // 3. Xóa mềm thành công
    res.status(200).json({
      success: true,
      msg: "Xóa mềm tài khoản người dùng thành công.",
    });
  } catch (err) {
    // Lỗi Server (ví dụ: lỗi kết nối DB, ID không đúng định dạng Mongoose)
    console.error("Lỗi khi xóa người dùng:", err.message);
    res.status(500).json({ msg: "Lỗi Server nội bộ khi xóa dữ liệu." });
  }
};

// --- ĐẢM BẢO EXPORT (XUẤT) CÁC HÀM ĐỂ SERVER.JS CÓ THỂ GỌI ---
module.exports = {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
};
