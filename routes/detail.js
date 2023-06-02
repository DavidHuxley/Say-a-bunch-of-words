const router = require('express').Router();
const luxon = require('luxon');

// model import
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// 글 상세보기
router.get('/detail/:id', async (req, res) => {
    try{
        // 해당 게시물이 삭제 상태가 아닐때만 실행
        const detailPost = await Post.findOne({ _id: req.params.id, isDeleted: false });

        if (detailPost) {
            // 조회수 증가
            await Post.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
      
            const [postResult, userResult, commentResult] = await Promise.all([
              Post.findOne({ _id: req.params.id }),
              User.find(),
              Comment.find({ postId: req.params.id })
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