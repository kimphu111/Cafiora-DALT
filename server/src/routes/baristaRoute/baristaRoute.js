const express = require("express");

const router = express.Router();
const { auth } = require("../../middlewares/auth");
const {
  validateAccessToken,
} = require("../../middlewares/validateAccessToken");
const {
  getAllOrdersBarista,
  updateOrderStatus,
  getOrderDetailById,
} = require("../../controllers/baristaController");

// lấy tất cả other
router.get(
  "/barista/getAllOrders",
  validateAccessToken,
  auth(["barista"]),
  getAllOrdersBarista
);

router.get(
  "/barista/getOrderDetail/:id",
  validateAccessToken,
  auth(["barista"]),
  getOrderDetailById
);

//sửa other
router.put(
  "/barista/updateOrderStatus/:id",
  validateAccessToken,
  auth(["barista"]),
  updateOrderStatus
);

module.exports = router;
