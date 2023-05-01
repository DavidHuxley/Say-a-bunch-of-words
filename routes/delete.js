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
        // 해당 게시글을 북마크한 모든 유저들을 찾아서 북마크 삭제
        const bookmarkUsers = await req.app.DB.collection('USER').find({ bookmarkPosts: req.body.id }).toArray();
        for (let i = 0; i < bookmarkUsers.length; i++) {
            await req.app.DB.collection('USER').updateOne({ id: bookmarkUsers[i].id }, { $pull: { bookmarkPosts: req.body.id } });
        }

        // POST컬렉션에서 삭제요청자의 게시글 총 갯수(삭제상태가 아닌것만) 가져오기
        const postCount = await req.app.DB.collection('POST').countDocuments({ writer: req.user.nickname, isDeleted: false });

        //  삭제 요청자의 bookmarkPosts 갯수 가져오기
        const deleterInfo = await req.app.DB.collection('USER').findOne({ id: req.user.id });
        const bookmarkPostsCount = deleterInfo.bookmarkPosts.length;

        res.status(200).json( { postCount : postCount, bookmarkPostsCount : bookmarkPostsCount});
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
module.exports = router;