import multer from "multer";
import fs from "fs";
import path from "path";

const imageUpload = multer({ dest: "public/uploads" });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = "public/documents";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const documentUpload = multer({ storage: storage });

export { imageUpload, documentUpload };
