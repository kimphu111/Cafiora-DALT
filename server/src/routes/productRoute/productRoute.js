const express = require("express");
const router = express.Router();
const {
  validateAccessToken,
} = require("../../middlewares/validateAccessToken");
const { GetAllData } = require("../../controllers/productController");

// route nhan du lieu
router.route("/getProduct").get(validateAccessToken, GetAllData);

module.exports = router;
