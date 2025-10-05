const express = require('express');
const router = express.Router();
const { validateAccessToken } = require('../../middlewares/validateAccessToken');
const { GetAllData } = require('../../controllers/productController');

// route cashier dang ki tai khoan
router.route('/admin/cashierRegister').get(validateAccessToken, GetAllData);

module.exports = router;
