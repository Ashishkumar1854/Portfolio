import multer from 'multer';
import path from 'path';

/* ─── Image upload (jpg/png/webp/svg) ─── */
const imageStorage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkImageType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Images only (jpg, jpeg, png, webp, svg)!'));
};

const upload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => checkImageType(file, cb),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/* ─── Document upload (pdf/doc/docx + images) ─── */
const docStorage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) {
    cb(null, `attachment-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkDocType = (file, cb) => {
  const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];
  const mimeOk = allowedMimes.includes(file.mimetype);
  if (extname && mimeOk) return cb(null, true);
  cb(new Error('Only PDF, DOC, DOCX, JPG, PNG files are allowed!'));
};

const uploadDoc = multer({
  storage: docStorage,
  fileFilter: (req, file, cb) => checkDocType(file, cb),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export { upload as default, uploadDoc };
