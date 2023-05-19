const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const luxon = require('luxon');


//  '/'로 get 요청오면 자동으로 '/main'으로 리다이렉트

router.get('/', (req, res) => {
  res.redirect('/main');
});

router.post('/signin', passport.authenticate('local', {
  failureFlash: true
}), (req, res, next) => {
  // 회원탈퇴한 유저 체크
  if (req.user && req.user.isDeleted === true) {
    req.session.destroy();
    return res.status(200).json({ result: 'deletedAccount' }); // 탈퇴한 유저 응답
  } else if (req.isAuthenticated()) { //인증성공
    // 로그인 성공하면 COUNT 컬렉션에 로그인 횟수 1 증가
    req.app.DB.collection('COUNT').updateOne({ name: 'signInCount' }, { $inc: { totalcount: 1 } });
    req.app.DB.collection('USER').updateOne({ id: req.user.id }, { $push: { signInlog: luxon.DateTime.local().setZone('Asia/Seoul').toISO() } });
    return res.status(200).json({ result: 'success' });
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
      emailVisibility: false, // 이메일 공개 여부
      postList: [], // 작성한 게시물 목록
      commentList: [], // 작성한 댓글 목록
      likePosts: [], // 좋아요 누른 게시물 목록
      likeComments: [], // 좋아요 누른 댓글 목록
      bookmarkPosts: [], // 북마크한 게시물 목록
      signUpDate: luxon.DateTime.local().setZone('Asia/Seoul').toISO(), // 가입일
      signInlog: [] // 로그인 기록
      
      
    });
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;