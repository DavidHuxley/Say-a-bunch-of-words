const router = require('express').Router();
const luxon = require('luxon');

// model import
const Post = require('../models/post');
const User = require('../models/user');


// 검색 쿼리 생성 함수
function getSearchReq(searchValue) {
  return [
    {
      $search: {
        index: 'titleContentSearch',
        text: {
          query: searchValue,
          path: ['title', 'content', 'writer']
        }
      }
    },
    { $match: { isDeleted: false } },
    { $sort: { time: -1 } }
  ];
}

// 검색페이지
router.get('/search', async (req, res) => {
  const searchValue = req.query.value;
  if (!searchValue) { // 검색어가 비어있는 경우
    res.render('search.ejs', { POST: [], USER: [], cUSER: null, luxon: luxon, searchValue: '' });
    return;
  }
  
  const searchReq = getSearchReq(searchValue);

  try {
    const postResult = await Post.aggregate(searchReq)
      .limit(12)
      .exec();

    const authorIds = Array.from(new Set(postResult.map(post => post.writer)));

    const [authorsResult, currentUserResult] = await Promise.all([
      User.find({ nickname: { $in: authorIds } }).exec(),
      User.findOne({ id: req.user.id }).exec()
    ]);

    res.render('search.ejs', { POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon, searchValue: searchValue });
  } catch (error) {
    res.status(400).send('400 Bad Request');
  }
});

// 검색페이지 더보기
router.post('/searchSeeMore', async (req, res) => {
  const searchValue = req.body.searchValue;
  const seeMoreCount = req.body.count;

  const searchReq = getSearchReq(searchValue);

  try {
    const postResult = await Post.aggregate(searchReq)
      .skip(12 * seeMoreCount)
      .limit(12)
      .exec();

    const authorIds = Array.from(new Set(postResult.map(post => post.writer)));

    const [authorsResult, currentUserResult] = await Promise.all([
      User.find({ nickname: { $in: authorIds } }).exec(),
      User.findOne({ id: req.user.id }).exec()
    ]);

    res.json({ POST: postResult, USER: authorsResult, cUSER: currentUserResult, luxon: luxon });
  } catch (error) {
    res.status(400).send(error);
  }
});


module.exports = router;