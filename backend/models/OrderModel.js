// backend/models/OrderModel.js (ĐÃ SỬA LỖI VALIDATION)
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: {
      enum: ["Thanh toán khi nhận hàng", "Chuyển khoản"],
      type: String,
      required: true,
    },
    items: [
      {
        title: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String, // SỬA LỖI: THÊM 'Delivered' VÀ 'Processing' vào Enum
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Cancelled",
        "Delivered",
        "Processing",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
