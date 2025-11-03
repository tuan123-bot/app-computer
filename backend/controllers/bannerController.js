// backend/controllers/bannerController.js (ĐÃ SỬA LỖI VÀ HOÀN CHỈNH)

import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Banner from "../models/Banner.js";
// 🎯 LƯU Ý: Phải import các Model này nếu chúng được sử dụng đâu đó,
// nếu không dùng thì comment lại để tránh lỗi tham chiếu khi khởi tạo.

// Helper để lấy __dirname (Cần cho việc xóa file vật lý)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

// @desc Lấy tất cả Banner (GET /api/banners)
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ position: 1 });
  res.status(200).json(banners);
});

// @desc Tạo Banner mới (POST /api/banners)
const createBanner = asyncHandler(async (req, res) => {
  const { link, position } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    res.status(400);
    throw new Error("Vui lòng cung cấp file ảnh cho banner.");
  }

  const newBanner = new Banner({
    image: `/uploads/${imageFile.filename}`,
    link: link || "/",
    position: position || 0,
  });

  const savedBanner = await newBanner.save();
  res.status(201).json(savedBanner);
});

// @desc Cập nhật Banner (PUT /api/banners/:id)
const updateBanner = asyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  const { link, position, isActive } = req.body;
  const imageFile = req.file;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    res.status(404);
    throw new Error("Không tìm thấy Banner.");
  } // Nếu có file mới, xóa file cũ và cập nhật đường dẫn

  if (imageFile) {
    const oldImagePath = path.join(projectRoot, banner.image);
    if (
      fs.existsSync(oldImagePath) &&
      banner.image &&
      banner.image.includes("/uploads/")
    ) {
      fs.unlinkSync(oldImagePath);
    }
    banner.image = `/uploads/${imageFile.filename}`;
  } // Cập nhật các trường khác

  banner.link = link !== undefined ? link : banner.link;
  banner.position = position !== undefined ? position : banner.position;
  banner.isActive = isActive !== undefined ? isActive : banner.isActive;

  const updatedBanner = await banner.save();
  res.status(200).json(updatedBanner);
});

// @desc Xóa Banner (DELETE /api/banners/:id)
const deleteBanner = asyncHandler(async (req, res) => {
  const bannerId = req.params.id;
  const banner = await Banner.findById(bannerId);

  if (!banner) {
    res.status(404);
    throw new Error("Không tìm thấy Banner.");
  } // 1. Xóa file ảnh vật lý khỏi server

  const imagePath = path.join(projectRoot, banner.image);
  if (fs.existsSync(imagePath) && banner.image.includes("/uploads/")) {
    fs.unlinkSync(imagePath);
  } // 2. Xóa khỏi database

  await Banner.deleteOne({ _id: bannerId });

  res.status(200).json({ message: "Xóa Banner thành công." });
});

// --- EXPORT CÁC HÀM ---
export { createBanner, deleteBanner, getBanners, updateBanner };
