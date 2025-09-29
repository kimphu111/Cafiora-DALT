const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { cloudinary } = require('../configs/cloudinaryConfig');

// Sử dụng fields để upload nhiều file
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'audios',
        resource_type: 'auto',  // Chọn 'auto' để tự động nhận dạng loại file
        allowed_formats: ['mp3', 'jpg', 'png'], // Bạn có thể thêm nhiều định dạng cho các loại file khác nhau
    }
});

// Tạo middleware upload với fields để upload cả audio và image
const upload = multer({ storage });

const uploadFilesMiddleware = (req, res, next) => {
    upload.fields([
        { name: 'audio', maxCount: 1 }, // audio sẽ có 1 file
        { name: 'image', maxCount: 1 }  // image sẽ có 1 file
    ])(req, res, (err) => {
        try {
            // Xử lý lỗi Multer
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(400).json({ message: 'File upload error: ' + err.message });
            } else if (err) {
                // Xử lý lỗi không phải từ Multer
                console.error('Unknown error:', err);
                return res.status(500).json({ message: 'An unexpected error occurred' });
            }

            // Nếu không có tệp audio và image, chỉ cần gọi next mà không làm gì
            if (!req.files || (!req.files.audio && !req.files.image)) {
                return next(); // Tiếp tục đến middleware tiếp theo mà không làm gì
            }

            // Kiểm tra nếu có tệp audio hoặc image thì upload và gán vào req
            if (req.files.audio) {
                req.audio = req.files.audio[0];  // Audio là mảng, lấy phần tử đầu tiên
                console.log('Audio file uploaded:', req.audio);
            }
            if (req.files.image) {
                req.image = req.files.image[0];  // Image là mảng, lấy phần tử đầu tiên
                console.log('Image file uploaded:', req.image);
            }

            console.log('Audio file uploaded:', req.audio);
            console.log('Image file uploaded:', req.image);

            next(); // Tiếp tục với middleware/controller tiếp theo
        } catch (error) {
            console.log("Error during file upload:", error);
            res.status(500).json({ message: 'Error during file upload.' });
        }
    });
};

module.exports = uploadFilesMiddleware; // Export middleware
