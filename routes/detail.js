const router = require('express').Router();
const luxon = require('luxon');

// 글 상세보기
router.get('/detail/:id', async (req, res) => {
    try{
        // 해당 게시물이 삭제 상태가 아닐때만 실행
        const detailPost = await req.app.DB.collection('POST').findOne({ _id: req.params.id });

        if (detailPost.isDeleted === false) {
        // 조회수 증가
        await req.app.DB.collection('POST').updateOne({ _id: req.params.id }, { $inc: { views: 1 } });

        const [postResult, userResult, commentResult] = await Promise.all([
            req.app.DB.collection('POST').findOne({ _id: req.params.id }),
            req.app.DB.collection('USER').find().toArray(),
            req.app.DB.collection('COMMENT').find({ postId: req.params.id }).toArray()
        ]);


        // 해당 게시물의 작성자 정보
        const postWriter = postResult.writer;
        const writerInfo = userResult.find(user => user.nickname === postWriter);

        // 로그인 유저
        const currentUserResult = userResult.find(user => user.id === req.user.id);

        res.render('detail.ejs', { POST: postResult, USER: userResult , COMMENT: commentResult , cUSER: currentUserResult, WRITER: writerInfo, luxon: luxon });
    } else {
        res.status(404).send('404 Not Found');
    }
    } catch (error) {
        res.status(400).send('400 Bad Request');
        console.log(error);
    }
});



module.exports = router;