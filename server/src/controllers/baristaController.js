const asyncHandler = require("express-async-handler");

const Order = require("../models/ortherModel");
const OrderDetail = require("../models/ortherDetailModel");
//@desc getAllOrdersBarista
//@route GET /api/barista/getAllOrders
//@access private
const getAllOrdersBarista = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("employee_id", "username email")
      .sort({ createdAt: -1 });

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const orderDetail = await OrderDetail.findOne({ order_id: order._id });
        return {
          order_id: order._id,
          table_number: order.table_number,
          customer_name: order.customer_name,
          employee: order.employee_id,
          status: order.status,
          note: order.note,
          createdAt: order.createdAt,
          orderDetail_id: orderDetail ? orderDetail._id : null, // ID để lấy chi tiết
        };
      })
    );

    res.json({
      message: "Lấy danh sách đơn hàng thành công",
      data: fullOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error });
  }
});

//@desc getOrderDetailById
//@route GET /api/barista/getOrderDetail/:id
//@access private
const getOrderDetailById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const orderDetail = await OrderDetail.findById(id).populate(
      "items.product_id"
    );
    if (!orderDetail) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.json({
      message: "Lấy chi tiết đơn hàng thành công",
      data: orderDetail,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error });
  }
});

//@desc update status
//@route put /api/barista/updateOrderStatus/:id
//@access private
const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (status !== undefined) order.status = status;

    await order.save();

    res.json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng", error });
  }
});

module.exports = {
  getAllOrdersBarista,
  updateOrderStatus,
  getOrderDetailById,
};
