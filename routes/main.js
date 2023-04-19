const router = require('express').Router();
const luxon = require('luxon');

// 메인 페이지
router.get('/main', async (req, res) => {
    try{
        const [postResult, userResult, currentUserResult] = await Promise.all([
            req.app.DB.collection('POST').find().toArray(),
            req.app.DB.collection('USER').find().toArray(),
            req.app.DB.collection('USER').findOne({ id: req.user.id })
          ]);
          res.render('main.ejs', { POST: postResult, USER: userResult, cUSER: currentUserResult, luxon: luxon });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});

// 좋아요
router.post('/likeUp', async (req, res) => {
    try{
        const postId = req.body.id;
        const userId = req.user._id;
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $inc: { like: 1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $push: { likePosts: postId } });
        res.status(200).send();
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});
// 좋아요 취소
router.post('/likeDown', async (req, res) => {
    try{
        const postId = req.body.id;
        const userId = req.user._id;
        await req.app.DB.collection('POST').updateOne({ _id: postId }, { $inc: { like: -1 } });
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $pull: { likePosts: postId } });
        res.status(200).send();
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
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $push: { bookmarkPosts: postId } });
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
        await req.app.DB.collection('USER').updateOne({ _id: userId }, { $pull: { bookmarkPosts: postId } });
        res.status(200).send();
    }
    catch (error) {
        res.status(400).send('400 Bad Request');
    }
});


module.exports = router;