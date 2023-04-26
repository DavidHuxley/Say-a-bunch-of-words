const router = require('express').Router();

router.post('/commentDelete', async (req, res) => {
    try{
        // 댓글 삭제상태로 만들기
        await req.app.DB.collection('COMMENT').updateOne({ _id: req.body.id }, { $set: { isDeleted: true } });

        // 게시물의 댓글 수 -1
        const commentResult = await req.app.DB.collection('COMMENT').findOne({ _id: req.body.id });
        const postId = commentResult.postId;
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $inc: { comment: -1 } });
        const postCommentCount = await req.app.DB.collection('POST').findOne({ _id: postId });

        // 유저 정보에서 댓글 삭제
        await req.app.DB.collection('USER').updateOne({ id: req.user.id }, { $pull: { commentList: req.body.id } });

    
        res.status(200).json( { postCommentCount : postCommentCount.comment });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

router.post('/postDelete', async (req, res) => {
    try{
        // 게시글 삭제 상태로 변환
        await req.app.DB.collection('POST').updateOne({ _id: req.body.id }, { $set: { isDeleted: true } });

        // 유저 정보에서 게시글 삭제
        await req.app.DB.collection('USER').updateOne({ id: req.user.id }, { $pull: { postList: req.body.id } });

        res.status(200).send();
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
module.exports = router;