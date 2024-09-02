import multer from "multer";
import fs from "fs";

const fileUpload = multer({ dest: "public/uploads" });

export { fileUpload };
