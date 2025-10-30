const Product = require("../models/Product");

/**
 * @desc    Lấy danh sách sản phẩm (Active, chưa xóa)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    // 1. Truy vấn Mongoose: Chỉ lấy sản phẩm chưa bị xóa và đang "active"
    const products = await Product.find({
      deleted: false,
      status: "active",
    })
      .select("title description price discountPercentage thumbnail _id") // Chỉ lấy các trường cần thiết
      .limit(20) // Giới hạn số lượng
      .sort({ position: 1 }); // Sắp xếp theo vị trí

    // 2. Phản hồi lại Client (App/Web)
    // Trả về đối tượng chứa mảng (để Frontend Admin có thể hoạt động)
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Thêm sản phẩm mới
 * @route   POST /api/products
 * @access  Admin
 */
const productList = async (req, res) => {
  try {
    const newProductData = req.body;

    // 1. Kiểm tra dữ liệu bắt buộc
    if (!newProductData.title || newProductData.price === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu trường 'title' hoặc 'price' bắt buộc.",
      });
    }

    // 2. Tạo đối tượng Product mới
    const productToSave = {
      ...newProductData,
      status: "active", // Đảm bảo sản phẩm mới luôn Active
      deleted: false,
    };

    const newProduct = new Product(productToSave);

    // 3. Lưu sản phẩm vào Database (Mongoose sẽ tự validation)
    const savedProduct = await newProduct.save();

    // 4. Phản hồi thành công
    res.status(201).json({
      status: "success",
      message: "Thêm sản phẩm thành công!",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Bắt lỗi validation (ví dụ: price < 0, stock không phải số)
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: error.message });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error during product creation",
    });
  }
};

/**
 * @desc    Lấy chi tiết 1 sản phẩm theo ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;

    // Tìm sản phẩm theo ID, không bao gồm các sản phẩm đã bị xóa
    const product = await Product.findOne({
      _id: productId,
      deleted: false,
    }).select("title description price discountPercentage thumbnail stock"); // 🚨 ĐÃ SỬA: Chủ động chọn các trường cần thiết cho trang chi tiết

    // 1. Kiểm tra nếu không tìm thấy sản phẩm
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy sản phẩm." });
    }

    // 2. Trả về chi tiết sản phẩm
    res.status(200).json(product);
  } catch (err) {
    // Bắt lỗi khi ID không hợp lệ (CastError)
    if (err.name === "CastError") {
      return res.status(404).json({
        status: "error",
        message: "ID sản phẩm không hợp lệ.",
      });
    }

    console.error("Lỗi lấy dữ liệu chi tiết sản phẩm:", err.message);
    res.status(500).json({
      status: "error",
      message: "Lỗi Server nội bộ khi tải chi tiết sản phẩm.",
    });
  }
};

module.exports = { getProducts, productList, getProductDetail };
