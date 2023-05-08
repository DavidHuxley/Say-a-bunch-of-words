const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const uploadDir = path.join(__dirname, '../public/image');

// 파일 업로드
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`;
      req.filename = filename;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif' && ext !== '.webp') {
      return cb(new Error('PNG, JPG, JPEG, GIF, WEBP 파일만 업로드하세요'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// 파일 업로드
router.post('/upload', async (req, res) => {
  upload.single('cardImg')(req, res, (err) => {
    try {
      const imageUrl = `/public/image/${req.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(400).send();
    }
  })
});

// 프로필이미지 업로드
router.post('/profileImgUpload', async (req, res) => {
  upload.single('profileImgInput')(req, res, (err) => {
    try {
      const imageUrl = `/public/image/${req.filename}`;
      req.app.DB.collection('USER').updateOne({ _id: req.user._id }, { $set: { profileImg: imageUrl } });
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(400).send();
    }
  })
});

module.exports = router;