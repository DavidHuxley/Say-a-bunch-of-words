const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const luxon = require('luxon');

// model import
const User = require('../models/user');
const Count = require('../models/count');

//  '/'로 get 요청오면 자동으로 '/main'으로 리다이렉트
router.get('/', (req, res) => {
  res.redirect('/main');
});

router.post('/signin', passport.authenticate('local', {
  failureFlash: true
}), async (req, res, next) => {
  // 회원탈퇴한 유저 체크
  try {
    if (req.user && req.user.isDeleted === true) {
      req.session.destroy();
      return res.status(200).json({ result: 'deletedAccount' });
    } else if (req.isAuthenticated()) { // 인증성공시
      // 로그인 성공하면 COUNT 컬렉션에 로그인 횟수 1 증가
      await Count.updateOne({ name: 'signInCount' }, { $inc: { totalcount: 1 } }).exec();
      await User.updateOne({ id: req.user.id }, { $push: { signInlog: luxon.DateTime.local().setZone('Asia/Seoul').toISO() } }).exec();
      return res.status(200).json({ result: 'success' });
    }

    // 인증 실패
    return res.status(401).send(req.flash('error'));
  } catch (error) {
    next(error);
  }
});


router.post('/signup', async (req, res) => {
  try {
    const idToLowerCase = req.body.id.toLowerCase();
    const defaultProfileImg = '/assets/profile/defaultProfile.png';

    const emailRegExp = /^\S+@\S+\.\S+$/;
    const nameRegExp = /^[a-zA-Z0-9]{6,10}$/;
    const passRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

    // 입력된 이메일이 유효한지 확인
    if (!emailRegExp.test(req.body.email)) {
      res.status(400).json({ error: 'Invalid Email' });
      return;
    }

    // 입력된 아이디가 유효한지 확인
    if (!nameRegExp.test(req.body.id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    // 입력된 비밀번호가 유효한지 확인
    if (!passRegExp.test(req.body.pw)) {
      res.status(400).json({ error: 'Invalid Password' });
      return;
    }

    const existingUserEmail = await User.findOne({ email: req.body.email });
    if (existingUserEmail) {
      res.status(409).json({ error: 'Duplicate Email' });
      return;
    }

    const existingUserId = await User.findOne({ id: idToLowerCase });
    if (existingUserId) {
      res.status(409).json({ error: 'Duplicate ID' });
      return;
    }

    // 비밀번호 암호화
    const hashedPw = await bcrypt.hash(req.body.pw, 10); // 2의10승, 곧 1024번 해싱함

    await User.create({
      email: req.body.email,
      id: idToLowerCase,
      pw: hashedPw,
      nickname: idToLowerCase,
      profileImg: defaultProfileImg,
      isVerified: false,
      emailVisibility: false,
      postList: [],
      commentList: [],
      likePosts: [],
      likeComments: [],
      bookmarkPosts: [],
      signUpDate: luxon.DateTime.local().setZone('Asia/Seoul').toISO(),
      signInlog: [],
      isDeleted: false 
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;