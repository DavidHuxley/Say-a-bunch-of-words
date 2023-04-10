var router = require('express').Router();

function sessionCheck(req, res, next){
    if (req.user){
        // console.log(req.user);
        next()
    } else {
        res.render('signInUp.ejs', {});
    }
}

router.get('/', sessionCheck ,(req, res) => {

    req.app.DB.collection('POST').find().toArray((error, result) => {
        // console.log(result);
        res.render('main.ejs', { TODOs: result });
    }); // POST collection 내의 모든 데이터꺼내고 list.ejs에 랜더링해서 보여줌
});

module.exports = router;