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



module.exports = router;