// const songModel = require("../models/songModel");
// const asyncHandler = require("express-async-handler");
// const { DateTime } = require("luxon");
// const { cloudinary } = require("../configs/cloudinaryConfig");

// //@desc adminAuth
// //@route GET /api/admin/auth
// //@access private
// const adminAuth = asyncHandler(async (req, res) => {
//   try {
//     const allSongs = await songModel.find(); // lấy tất cả dữ liệu
//     res.status(200).json({
//       message: "lấy dữ liệu thành công",
//       success: true,
//       songs: allSongs,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi khi lấy dữ liệu bài hát", error });
//   }
// });

// //@desc adminAuth
// //@route post /api/admin/uploadAudio
// //@access private
// const uploadAudio = asyncHandler(async (req, res) => {
//   try {
//     const { title, artist, lyrics } = req.body;
//     const fileAudio = req.audio;
//     const fileImage = req.image;

//     if (!fileAudio) {
//       return res.status(400).json({ message: "No audio file uploaded" });
//     }

//     if (!fileImage) {
//       return res.status(400).json({ message: "No image file uploaded" });
//     }
//     const audioUrl = fileAudio.path;
//     const imageUrl = fileImage.path;
//     const time = String(
//       DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss")
//     );

//     if (!title || !artist || !lyrics) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const audio = await songModel.create({
//       title,
//       artist,
//       lyrics,
//       url_audio: audioUrl,
//       url_img: imageUrl,
//       releaseDate: time,
//     });

//     if (audio) {
//       res
//         .status(201)
//         .json({ message: "Upload thành công!", audio, success: true });
//     } else {
//       res.status(400);
//       throw new Error("Song data is not valid");
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const updateAudio = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, artist, lyrics } = req.body;
//     const fileImage = req.image;
//     const imageUrl = fileImage ? fileImage.path : null; // URL của image (ảnh)

//     // Lấy thông tin bài hát từ database
//     const song = await songModel.findById(id);
//     if (!song) {
//       return res
//         .status(404)
//         .json({ message: "Không tìm thấy bài hát với ID này" });
//     }

//     if (song && song.url_img) {
//       // Xóa ảnh cũ trên Cloudinary
//       const publicId = "audios/" + song.url_img.split("/").pop().split(".")[0]; // Lấy public_id từ URL của ảnh
//       await cloudinary.uploader.destroy(publicId); // Xóa ảnh trên Cloudinary
//     }
//     const time = String(
//       DateTime.now().setZone("Asia/Ho_Chi_Minh").toFormat("yyyy-MM-dd HH:mm:ss")
//     );

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
//       res

//         .status(200)
//         .json({ message: "Cập nhật thành công!", song: updatedSong });
//     } else {
//       res.status(404).json({ message: "Không tìm thấy bài hát để cập nhật" });
//     }
//   } catch (error) {
//     console.log(error);

//     res
//       .status(500)
//       .json({ message: "Lỗi khi cập nhật bài hát", error: error.message });
//   }
// });

// const deleteAudio = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(id);

//     // Lấy thông tin bài hát từ database
//     const song = await songModel.findById(id);
//     if (!song) {
//       return res
//         .status(404)
//         .json({ message: "Không tìm thấy bài hát với ID này" });
//     }
//     // Xoá file ảnh trên Cloudinary (nếu có)
//     if (song.url_img) {
//       const publicIdImg =
//         "audios/" + song.url_img.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicIdImg);
//     }

//     // Xoá file audio trên Cloudinary (nếu có)
//     if (song.url_audio) {
//       const publicIdAudio =
//         "audios/" + song.url_audio.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicIdAudio, {
//         resource_type: "video",
//       });
//     }
//     // Xoá khỏi database
//     await songModel.findByIdAndDelete(id);
//     res.status(200).json({ message: "Xoá bài hát thành công", success: true });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi xoá bài hát", error: error.message });
//   }
// });
// module.exports = { uploadAudio, adminAuth, updateAudio, deleteAudio };
