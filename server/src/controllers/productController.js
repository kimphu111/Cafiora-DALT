const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

//@desc adminAuth
//@route GET /api/admin/auth
//@access private
const GetAllData = asyncHandler(async (req, res) => {
  try {
    const allProduct = await Product.find(); // lấy tất cả dữ liệu
    res.status(200).json({
      message: 'lấy dữ liệu thành công',
      success: true,
      songs: allProduct,
    });
  } catch (error) {
    res.status(500).json({ message: `Lỗi khi lấy dữ liệu bài hát : ${error}` });
  }
});
module.exports = { GetAllData };
