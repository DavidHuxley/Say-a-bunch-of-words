const router = require('express').Router();
const luxon = require('luxon');

router.get('/personal', (req, res) => {
    // 로그인한 사용자의 정보를 가져와서 res.data로 응답.
    res.status(200).json({ nickname: req.user.nickname });
});

router.get('/@:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;
        const paramsUser = await req.app.DB.collection('USER').findOne({ nickname: nickname });
        if (!paramsUser) {
            return res.status(404).send('User not found');
        }

        // 해당 유저의 게시글
        const paramsUserPost = await req.app.DB.collection('POST').find({ writer: nickname }).toArray();

        // 해당 유저의 bookmarkPosts에서 id 추출
        const bookmarkPostsId = paramsUser.bookmarkPosts;

        // 원래 배열 순서 유지하면서 post컬렉션에서 찾아서 넣어쥼
        const bookmarkPosts = [];

        for (let i = 0; i < bookmarkPostsId.length; i++) {
            const post = await req.app.DB.collection('POST').findOne({ _id: bookmarkPostsId[i] });
            bookmarkPosts.push(post);
        }

        // 현재 접속유저
        const cUser = await req.app.DB.collection('USER').findOne({ nickname: req.user.nickname });

        res.render('personal.ejs', {
            pU: paramsUser,
            cU: cUser,
            pUP: paramsUserPost,
            bP: bookmarkPosts,
            luxon: luxon
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/proConNicknameEditCheck', async (req, res) => {
    try {
        const nickname = req.body.nickname.toLowerCase();
        const user = await req.app.DB.collection('USER').findOne({ nickname: nickname });
        if (user) {
            return res.status(200).json({ result: true });
        } else {
            return res.status(200).json({ result: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/proConEdit', async (req, res) => {
    try {
        const nickname = req.body.nickname.toLowerCase();
        const emailView = req.body.emailView;
        await req.app.DB.collection('USER').updateOne({ nickname: req.user.nickname }, { $set: { nickname: nickname, emailVisibility: emailView } });
        await req.app.DB.collection('POST').updateMany({ writer: req.user.nickname }, { $set: { writer: nickname } });
        await req.app.DB.collection('COMMENT').updateMany({ writer: req.user.nickname }, { $set: { writer: nickname } });

        res.status(200).json({ result: true, nickname: nickname });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/deleteAccount', async (req, res) => {
    try {
        
        // POST 컬렉션에서 탈퇴 유저 게시글 삭제상태로 전환
        await req.app.DB.collection('POST').updateMany({ writer: req.user.nickname }, { $set: { isDeleted: true } });
        // COMMENT 컬렉션에서 탈퇴 유저 댓글 삭제상태로 전환
        await req.app.DB.collection('COMMENT').updateMany({ writer: req.user.nickname }, { $set: { isDeleted: true } });
        // COMMENT 컬렉션에서 탈퇴 유저가 댓글이 삭제상태로 전환될 때 해당 댓글이 달린 게시물의 id(postId)를 추출해서 JSON 배열로 저장
        const deletedComment = await req.app.DB.collection('COMMENT').find({ writer: req.user.nickname }).toArray();
        const deletedCommentPostId = [];
        for (let i = 0; i < deletedComment.length; i++) {
            deletedCommentPostId.push(deletedComment[i].postId);
        }
        for (let i = 0; i < deletedCommentPostId.length; i++) {
            await req.app.DB.collection('POST').updateOne({ _id: deletedCommentPostId[i] }, { $inc: { comment: -1 } });
        }

        await req.app.DB.collection('USER').updateOne({ id: req.user.id }, { $set: { isDeleted: true } });
        await req.app.DB.collection('USER').updateOne({ id: req.user.id }, { $set: { deletedAt: luxon.DateTime.local().setZone('Asia/Seoul').toISO() } });
        res.status(200).json({ result: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;