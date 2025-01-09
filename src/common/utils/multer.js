const multer = require("multer")
const path = require("path")
const fs = require("fs")
const httpErrors = require("http-errors")
const {v4: uuidv4} = require("uuid")

const uploadBasePath = process.env.UPLOAD_BASE_PATH || path.join(process.cwd(), "public", "upload");

const whiteListFormat = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (whiteListFormat.includes(file.mimetype)) {
    cb(null, true);
  } else {
   
    cb(new httpErrors.BadRequest("File format is not supported"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the upload directory exists asynchronously
    fs.mkdir(uploadBasePath, { recursive: true }, (err) => {
      if (err) {
        // logger.error("Failed to create upload directory", err);
        return cb(new httpErrors.InternalServerError("Failed to create upload directory"));
      }
      cb(null, uploadBasePath);
    });
  },
  filename: (req, file, cb) => {
    const format = path.extname(file.originalname);
    if (!format) {
      return cb(new httpErrors.BadRequest("Invalid file format"));
    }
    // Create a unique filename using timestamp and UUID
    const filename = `${Date.now()}-${uuidv4()}${format}`;
    cb(null, filename);
  }
});

const uploadFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  }
});

module.exports = { uploadFile };