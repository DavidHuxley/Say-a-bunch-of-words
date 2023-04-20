const router = require('express').Router();
const luxon = require('luxon');

// 검색
router.get('/search', async (req, res) => {
    const searchValue = req.query.value;
    if (!searchValue) { // 검색어가 비어있는 경우
        res.render('search.ejs', { POST: [], USER: [], cUSER: null, luxon: luxon, searchValue: ''});
        return;
    }
    const searchReq = [
        {
            $search: {
                index: 'titleContentSearch',
                text: {
                    query: searchValue,
                    path: ['title', 'content']
                }
            }
        }, 
        { $sort : { time : -1 }}
    ];
    try {
        const [postResult, userResult, currentUserResult] = await Promise.all([
            req.app.DB.collection('POST').aggregate(searchReq).toArray(),
            req.app.DB.collection('USER').find().toArray(),
            req.app.DB.collection('USER').findOne({ id: req.user.id })
            ]);
        res.render('search.ejs', { POST: postResult, USER: userResult, cUSER: currentUserResult, luxon: luxon, searchValue: searchValue});    
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

module.exports = router;