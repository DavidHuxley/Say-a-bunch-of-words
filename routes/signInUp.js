const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

// Sign In
router.get('/entrance', (req, res) => {
    res.render('signInUp.ejs');
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

      const existingUserEmail = await req.app.DB.collection('USER').findOne({email: req.body.email});
      if (existingUserEmail) {
        res.status(409).json({ error:'Duplicate Email' });
        return;
      }
  
      const existingUserId = await req.app.DB.collection('USER').findOne({id:  idToLowerCase});
      if (existingUserId) {
        res.status(409).json({ error:'Duplicate ID' });
        return;
      }

      // 비밀번호 암호화
      const hashedPw = await bcrypt.hash(req.body.pw, 10); // 2의10승, 곧 1024번 해싱함
  
      await req.app.DB.collection('USER').insertOne({
        email: req.body.email,
        id:  idToLowerCase,
        pw: hashedPw,
        savePosts: []
      });
      res.status(200).send();
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;