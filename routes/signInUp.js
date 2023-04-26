const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const luxon = require('luxon');


router.get('/', async (req, res) => {
  try {
    if (req.user) {
      const [postResult, userResult] = await Promise.all([
        req.app.DB.collection('POST').find().toArray(),
        req.app.DB.collection('USER').find().toArray()
      ]);

      const currentUserResult = userResult.find(user => user.id === req.user.id);

      res.render('main.ejs', { POST: postResult, USER: userResult, cUSER: currentUserResult, luxon: luxon });
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
      email: req.body.email, // 이메일, 대소문자 구분함
      id: idToLowerCase, // 아이디, 대소문자 구분 안 함
      pw: hashedPw, // 해싱된 비밀번호 (원본 못찾아줌)
      nickname: idToLowerCase, // 닉네임, 대소문자 구분 안 함
      profileImg: defaultProfileImg, // 프로필 이미지
      isVerified: false, // 이메일 인증 여부
      postList: [], // 작성한 게시물 목록
      commentList: [], // 작성한 댓글 목록
      likePosts: [], // 좋아요 누른 게시물 목록
      likeComments: [], // 좋아요 누른 댓글 목록
      bookmarkPosts: [] // 북마크한 게시물 목록
      
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;