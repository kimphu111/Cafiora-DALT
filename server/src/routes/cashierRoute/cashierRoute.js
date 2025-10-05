const express = require('express');
const uploadFilesMiddleware = require('../../middlewares/upLoad');
const { uploadProduct, cashierRegister } = require('../../controllers/cashierController');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { validateAccessToken } = require('../../middlewares/validateAccessToken');

// route cashier dang ki tai khoan
router
  .route('/admin/cashierRegister')
  .post(validateAccessToken, auth(['cashier']), cashierRegister);
router
  .route('/admin/uploadProduct')
  .post(validateAccessToken, auth(['cashier']), uploadFilesMiddleware, uploadProduct);
// router
//   .route('/admin/updatedAudio/:id')
//   .put(validateAccessToken, auth(['admin']), uploadFilesMiddleware, updateAudioController);
// router.route('/admin/deleteAudio/:id').delete(validateAccessToken, auth(['admin']), deleteAudio);

module.exports = router;
