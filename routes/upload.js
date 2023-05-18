const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


const postImgDir = '/public/image/postImg';
const profileImgDir = '/public/image/profileImg';

// const postImgDir = path.join(__dirname, '../public/image/postImg');
// const profileImgDir = path.join(__dirname, '../public/image/profileImg');

const multerGoogleStorage = require('multer-google-storage');


// google storage upload
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: process.env.ENV_BUCKET_NAME,
    projectId: process.env.ENV_PROJECT_ID,
    keyFilename: process.env.ENV_KEY_FILE,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const userId = req.user.id;
      let directory;
      if (file.fieldname === 'cardImg') {
        directory = postImgDir;
      } else if (file.fieldname === 'profileImgInput') {
        directory = profileImgDir;
      }
      const filename = `${directory}/${userId}_${uuidv4()}${ext}`;
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
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       if (file.fieldname === 'cardImg') {
//         cb(null, postImgDir);
//       } else if (file.fieldname === 'profileImgInput') {
//         cb(null, profileImgDir);
//       }
//     },
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const userId = req.user.id;
//       const filename = `${userId}_${uuidv4()}${ext}`;
//       req.filename = filename;
//       cb(null, filename);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif' && ext !== '.webp') {
//       return cb(new Error('PNG, JPG, JPEG, GIF, WEBP 파일만 업로드하세요'));
//     }
//     cb(null, true);
//   },
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

const gcsbUrl = `https://storage.googleapis.com/${process.env.ENV_BUCKET_NAME}`;

// google storage file upload
router.post('/upload', async (req, res) => {
  upload.single('cardImg')(req, res, (err) => {
    try {
      const imageUrl = `${gcsbUrl}${req.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(400).send();
    }
  })
});

// 파일 업로드
// router.post('/upload', async (req, res) => {
  //   upload.single('cardImg')(req, res, (err) => {
    //     try {
      //       const imageUrl = `/public/image/postImg/${req.filename}`;
      //       res.status(200).json({ imageUrl });
      //     } catch (error) {
//       res.status(400).send();
//     }
//   })
// });

// google storage profile upload
router.post('/profileImgUpload', async (req, res) => {
  upload.single('profileImgInput')(req, res, (err) => {
    try {
      const imageUrl = `${gcsbUrl}${req.filename}`;
      req.app.DB.collection('USER').updateOne({ _id: req.user._id }, { $set: { profileImg: imageUrl } });
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(400).send();
    }
  })
});

// 프로필이미지 업로드
// router.post('/profileImgUpload', async (req, res) => {
//   upload.single('profileImgInput')(req, res, (err) => {
//     try {
//       const imageUrl = `/public/image/profileImg/${req.filename}`;
//       req.app.DB.collection('USER').updateOne({ _id: req.user._id }, { $set: { profileImg: imageUrl } });
//       res.status(200).json({ imageUrl });
//     } catch (error) {
//       res.status(400).send();
//     }
//   })
// });

// 프로필이미지 제거
const defaultProfileImg = '/assets/profile/defaultProfile.png';
router.post('/profileImgDelete', async (req, res) => {
  try {
    req.app.DB.collection('USER').updateOne({ _id: req.user._id }, { $set: { profileImg: defaultProfileImg } });
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;