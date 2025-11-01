const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["Thanh toán khi nhận hàng", "Chuyển khoản"],
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
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // Mongoose tự động đặt tên là 'orders'
  }
);

module.exports = mongoose.model("Order", OrderSchema);
