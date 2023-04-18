const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const luxon = require('luxon');


router.get('/', async (req, res) => {
  try {// 로그인 했을 때는 메인 페이지로, 로그인 안 했을 때는 로그인 페이지로 보내줌
    if (req.user) {
      const [postResult, userResult] = await Promise.all([
        req.app.DB.collection('POST').find().toArray(),
        req.app.DB.collection('USER').find().toArray()
      ]);
      res.render('main.ejs', { POST: postResult, USER: userResult, luxon: luxon});
    } else {
      res.render('signInUp.ejs');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/signin', passport.authenticate('local', {
  failureFlash: true
}), (req, res, next) => {
  // 인증 성공
  if (req.isAuthenticated()) {
    return res.status(200).send();
  }
  // 인증 실패
  return res.status(401).send(req.flash('error'));
});


router.post('/signup', async (req, res) => {
  try {
    const idToLowerCase = req.body.id.toLowerCase();
    const defaultProfileImg = '/assets/profile/defaultProfile.png';
    const existingUserEmail = await req.app.DB.collection('USER').findOne({ email: req.body.email });
    if (existingUserEmail) {
      res.status(409).json({ error: 'Duplicate Email' });
      return;
    }

    const existingUserId = await req.app.DB.collection('USER').findOne({ id: idToLowerCase });
    if (existingUserId) {
      res.status(409).json({ error: 'Duplicate ID' });
      return;
    }

    // 비밀번호 암호화
    const hashedPw = await bcrypt.hash(req.body.pw, 10); // 2의10승, 곧 1024번 해싱함

    await req.app.DB.collection('USER').insertOne({
      email: req.body.email,
      id: idToLowerCase,
      pw: hashedPw,
      nickname: idToLowerCase,
      profileImg: defaultProfileImg,
      isVerified: false,
      postList: [],
      likePosts: [],
      savePosts: []
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;