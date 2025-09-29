const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute/userRoute");
router.use("/api", userRoute);

module.exports = router;
