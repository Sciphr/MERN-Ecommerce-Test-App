import express from 'express';
import path from 'path';
import multer from 'multer';
import cloudinary from 'cloudinary';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), async (req, res) => {
  const uploadPhoto = await cloudinary.v2.uploader.upload(`${req.file.path}`);
  console.log(uploadPhoto); // This will give you all the information back from the uploaded photo result
  console.log(uploadPhoto.url); // This is what we want to send back now in the  res.send
  res.send(uploadPhoto.url);
  // res.send(`/${req.file.path}`);
});

export default router;
