// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // ⚠️ QUAN TRỌNG: THAY THẾ 'YOUR_JWT_SECRET' BẰNG KHÓA BÍ MẬT CỦA BẠN
  // Chuỗi này phải khớp với chuỗi trong authMiddleware.js!
  return jwt.sign({ id }, "YOUR_JWT_SECRET", {
    expiresIn: "30d", // Token hết hạn sau 30 ngày
  });
};

export default generateToken;
