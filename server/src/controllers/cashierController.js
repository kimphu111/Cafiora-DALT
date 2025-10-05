const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');
const { cloudinary } = require('../configs/cloudinaryConfig');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const bcrypt = require('bcrypt'); // hoặc bcrypt

//@desc adminAuth
//@route GET /api/admin/auth
//@access private
// const GetAllData = asyncHandler(async (req, res) => {
//   try {
//     const allSongs = await songModel.find(); // lấy tất cả dữ liệu
//     res.status(200).json({
//       message: 'lấy dữ liệu thành công',
//       success: true,
//       songs: allSongs,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi lấy dữ liệu bài hát', error });
//   }
// });

//@desc Register User
//@route POST /api/users/register
//@access public
const cashierRegister = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('All fields are mandatory!');
    }

    if (role === 'cashier') {
      res.status(409);
      throw new Error('Khong the co cashier thu 2');
    }

    // Check user already exist
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error('Email is already in use!');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        username: user.username,
        success: true,
      });
    } else {
      res.status(400);
      throw new Error('User data is not valid');
    }
  } catch (error) {
    res.status(500);
    throw new Error(`An error occured: ${error}`);
  }
});

//@desc adminAuth
//@route post /api/admin/uploadProduct
//@access private
const uploadProduct = asyncHandler(async (req, res) => {
  try {
    const { nameProduct, price } = req.body;
    const fileImage = req.image;

    if (!fileImage) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const imageUrl = fileImage.path;
    const publicId = fileImage.filename;

    if (!nameProduct || !price) {
      // xóa ảnh nếu thiếu field
      await cloudinary.uploader.destroy(publicId);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.create({
      nameProduct,
      price: Number(price),
      status: true,
      urlImage: imageUrl,
    });

    if (product) {
      res.status(201).json({ message: 'Upload thành công!', product, success: true });
    } else {
      // xóa ảnh nếu tạo thất bại
      await cloudinary.uploader.destroy(publicId);
      res.status(400);
      throw new Error('Song data is not valid');
    }
  } catch (err) {
    if (req.image?.filename) {
      await cloudinary.uploader.destroy(req.image.filename);
    }
    res.status(500).json({ error: err.message });
  }
});

// const updateAudio = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, artist, lyrics } = req.body;
//     const fileImage = req.image;
//     const imageUrl = fileImage ? fileImage.path : null; // URL của image (ảnh)
//     const time = String(DateTime.now().setZone('Asia/Ho_Chi_Minh').toFormat('yyyy-MM-dd HH:mm:ss'));

//     // Lấy thông tin bài hát từ database
//     const song = await songModel.findById(id);
//     if (!song) {
//       return res.status(404).json({ message: 'Không tìm thấy bài hát với ID này' });
//     }

//     if (song && song.url_img) {
//       // Xóa ảnh cũ trên Cloudinary
//       const publicId = 'audios/' + song.url_img.split('/').pop().split('.')[0]; // Lấy public_id từ URL của ảnh
//       await cloudinary.uploader.destroy(publicId); // Xóa ảnh trên Cloudinary
//     }

//     // Chỉ thêm vào updateData những field nào có dữ liệu
//     const updateData = { releaseDate: time }; // Luôn cập nhật releaseDate
//     if (title) updateData.title = title;
//     if (artist) updateData.artist = artist;
//     if (lyrics) updateData.lyrics = lyrics;
//     if (imageUrl) updateData.url_img = imageUrl;

//     const updatedSong = await songModel.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });
//     if (updatedSong) {
//       res.status(200).json({ message: 'Cập nhật thành công!', song: updatedSong });
//     } else {
//       res.status(404).json({ message: 'Không tìm thấy bài hát để cập nhật' });
//     }
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({ message: 'Lỗi khi cập nhật bài hát', error: error.message });
//   }
// });

// const deleteAudio = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(id);

//     // Lấy thông tin bài hát từ database
//     const song = await songModel.findById(id);
//     if (!song) {
//       return res.status(404).json({ message: 'Không tìm thấy bài hát với ID này' });
//     }
//     // Xoá file ảnh trên Cloudinary (nếu có)
//     if (song.url_img) {
//       const publicIdImg = 'audios/' + song.url_img.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicIdImg);
//     }

//     // Xoá file audio trên Cloudinary (nếu có)
//     if (song.url_audio) {
//       const publicIdAudio = 'audios/' + song.url_audio.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicIdAudio, {
//         resource_type: 'video',
//       });
//     }
//     // Xoá khỏi database
//     await songModel.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Xoá bài hát thành công', success: true });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi xoá bài hát', error: error.message });
//   }
// });
module.exports = { uploadProduct, cashierRegister };
