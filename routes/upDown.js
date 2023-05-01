const router = require('express').Router();

// 좋아요
router.post('/likeUp', async (req, res) => {
    try {
        const postId = req.body.id;
        const userId = req.user._id;
        const post = await req.app.DB.collection('POST').findOne({ _id: postId });
        const likeCount = post.like + 1;
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $inc: { like: +1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $push: { likePosts: postId } });

        res.status(200).json({ likeCount });

    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
// 좋아요 취소
router.post('/likeDown', async (req, res) => {
    try{
        const postId = req.body.id;
        const userId = req.user._id;
        const post = await req.app.DB.collection('POST').findOne({ _id: postId });
        const likeCount = post.like - 1;
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $inc: { like: -1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $pull: { likePosts: postId } });
        
        res.status(200).json({ likeCount });
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
// 카드 저장
router.post('/bookmarkUp', async (req, res) => {
    try{
        const postId = req.body.id;
        const userId = req.user._id;
        const userid = req.user.id;
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $push: { bookmarkPosts: postId } });
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $push: { bookmarkUsers: userid } });
        res.status(200).send();
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
// 카드 저장 취소
router.post('/bookmarkDown', async (req, res) => {
    try{
        const postId = req.body.id;
        const userId = req.user._id;
        const userid = req.user.id;
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $pull: { bookmarkPosts: postId } });
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $pull: { bookmarkUsers: userid } });
        
        const bookmarkPostsCount = await req.app.DB.collection('USER').findOne({ _id: userId }).bookmarkPosts.length;
        
        res.status(200).json({ bookmarkPostsCount: bookmarkPostsCount });
    }
    catch (error) {
        res.status(400).send(error);
    }
});

router.post('/commentLikeUp', async (req, res) => {
    try{
        const commentId = req.body.id;
        const userId = req.user._id;
        const comment = await req.app.DB.collection('COMMENT').findOne({ _id: commentId });
        const likeCount = comment.like + 1;
        await req.app.DB.collection('COMMENT').updateOne({ _id: commentId }, { $inc: { like: +1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $push: { likeComments: commentId } });
        
        res.status(200).json({ likeCount });
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

router.post('/commentLikeDown', async (req, res) => {
    try{
        const commentId = req.body.id;
        const userId = req.user._id;
        const comment = await req.app.DB.collection('COMMENT').findOne({ _id: commentId });
        const likeCount = comment.like - 1;
        await req.app.DB.collection('COMMENT').updateOne({ _id: commentId }, { $inc: { like: -1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $pull: { likeComments: commentId } });
        
        res.status(200).json({ likeCount });
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

module.exports = router;