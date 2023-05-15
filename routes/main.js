const router = require('express').Router();
const luxon = require('luxon');

// 메인 페이지
router.get('/main', async (req, res) => {
    try {

      const postResult = await req.app.DB.collection('POST').find({ isDeleted: false }).sort({ time: -1 }).limit(12).toArray();
  
      const authorIds = Array.from(new Set(postResult.map(post => post.writer)));
  
      const [authorsResult, currentUserResult] = await Promise.all([
        req.app.DB.collection('USER').find({ nickname: { $in: authorIds } }).toArray(),
        req.app.DB.collection('USER').findOne({ id: req.user.id })
      ]);

      res.render('main.ejs', { POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon });
    } catch (error) {
      res.status(400).send('400 Bad Request');
    }
});

// 메인 페이지 더보기
router.post('/seeMore', async (req, res) => {
    try {

        const seeMoreCount = req.body.count;

        const postResult = await req.app.DB.collection('POST').find({ isDeleted: false }).sort({ time: -1 }).skip(12 * seeMoreCount).limit(12).toArray();

        const authorIds = Array.from(new Set(postResult.map(post => post.writer)));

        const [authorsResult, currentUserResult] = await Promise.all([
            req.app.DB.collection('USER').find({ nickname: { $in: authorIds } }).toArray(),
            req.app.DB.collection('USER').findOne({ id: req.user.id })
        ]);

        res.json({ POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
        

module.exports = router;