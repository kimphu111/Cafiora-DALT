const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute/userRoute');
const cashierRoute = require('./cashierRoute/cashierRoute');
const productRoute = require('./productRoute/productRoute');
router.use('/api', userRoute);
router.use('/api', cashierRoute);
router.use('/api', productRoute);

module.exports = router;
