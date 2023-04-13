const router = require('express').Router();
const auth = require('../middleware/auth.js');

// 메인 페이지
router.get('/', auth.sessionCheck ,(req, res) => {

    req.app.DB.collection('POST').find().toArray((error, result) => {
        // console.log(result);
        res.render('main.ejs', { TODOs: result });
    }); // POST collection 내의 모든 데이터를 가져옴
});

module.exports = router;