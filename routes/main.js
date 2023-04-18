const router = require('express').Router();
const luxon = require('luxon');

// 메인 페이지
router.get('/main', async (req, res) => {
    try{
        const [postResult, userResult] = await Promise.all([
            req.app.DB.collection('POST').find().toArray(),
            req.app.DB.collection('USER').find().toArray()
          ]);
          res.render('main.ejs', { POST: postResult, USER: userResult, luxon: luxon });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

module.exports = router;