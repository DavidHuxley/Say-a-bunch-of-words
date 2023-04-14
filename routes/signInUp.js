const router = require('express').Router();
const passport = require('passport');

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
      const existingUserEmail = await req.app.DB.collection('USER').findOne({email: req.body.email});
      if (existingUserEmail) {
        res.status(409).json({ error:'Duplicate Email' });
        return;
      }
  
      const existingUserId = await req.app.DB.collection('USER').findOne({id: req.body.id});
      if (existingUserId) {
        res.status(409).json({ error:'Duplicate ID' });
        return;
      }
  
      await req.app.DB.collection('USER').insertOne({
        email: req.body.email,
        id: req.body.id,
        pw: req.body.pw,
        savePosts: []
      });
      res.status(200).send();
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


// session 없을때 접근시 이동
router.get('/fail', (req, res) => {
    res.send('Sign In Fail')
});

module.exports = router;