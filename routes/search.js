const router = require('express').Router();
const luxon = require('luxon');

// 검색페이지
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
              path: ['title', 'content', 'writer']
            }
          }
        },
        {$match: { isDeleted: false }},
        {$sort: { time: -1 }}
      ];

    try {
        const postResult = await req.app.DB.collection('POST').aggregate(searchReq).limit(12).toArray();
        const authorIds = Array.from(new Set(postResult.map(post => post.writer)));
        const [authorsResult, currentUserResult] = await Promise.all([
            req.app.DB.collection('USER').find({ nickname: { $in: authorIds } }).toArray(),
            req.app.DB.collection('USER').findOne({ id: req.user.id })
            ]);
        res.render('search.ejs', { POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon, searchValue: searchValue});    
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

router.post('/searchSeeMore', async (req, res) => {

    const searchValue = req.body.searchValue;
    const seeMoreCount = req.body.count;

    const searchReq = [
        {
          $search: {
            index: 'titleContentSearch',
            text: {
              query: searchValue,
              path: ['title', 'content', 'writer']
            }
          }
        },
        {$match: { isDeleted: false }},
        {$sort: { time: -1 }}
      ];

    try {
        const postResult = await req.app.DB.collection('POST').aggregate(searchReq).skip(12 * seeMoreCount).limit(12).toArray();
        const authorIds = Array.from(new Set(postResult.map(post => post.writer)));

        const [authorsResult, currentUserResult] = await Promise.all([
            req.app.DB.collection('USER').find({ nickname: { $in: authorIds } }).toArray(),
            req.app.DB.collection('USER').findOne({ id: req.user.id })
        ]);

        res.json({ POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon });
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;