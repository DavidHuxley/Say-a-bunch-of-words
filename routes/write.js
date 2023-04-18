const router = require('express').Router();
const { DateTime } = require('luxon');

// 글쓰기 페이지 렌더링
router.get('/write', (req, res) => {
    req.app.DB.collection('USER').findOne({ id: req.user.id }, (error, result) => {
        if (result == null) {
            res.status(404).send('404 Not Found');
        } else {
            res.render('write.ejs', { user: result });
        };
    });
});



// 카드내용 서버로 전송
router.post('/newpost', async (req, res) => {
    try {
        await req.app.DB.collection('COUNT').findOne({ name: 'postNum' }, (error, result) => {
            console.log(result.totalPost);
            const currentTime = DateTime.local().toISO();
            var postNum = result.totalPost;
            var writer = {
                _id: postNum + 1, // 글 번호
                title: req.body.frontTitle, // 제목
                content: req.body.backContentText, // 내용 
                writer: req.user.nickname, // 작성자
                img: req.body.cardImgUrl, // 이미지경로
                time: currentTime, // 작성 시간
                like: 0, // 좋아요 수
                comment: 0, // 댓글 수
                commentList: [], // 댓글 ID 리스트 
                isDeleted: false, // 삭제 여부
            };

            req.app.DB.collection('POST').insertOne(writer, (error, result) => {
                if (error) return console.log(error);
                console.log('post complete');
                req.app.DB.collection('COUNT').updateOne(
                    { name: 'postNum' },
                    { $inc: { totalPost: 1 } },
                    (error, result) => {
                        if (error) { return console.log(error) };
                    });
                req.app.DB.collection('USER').updateOne(
                    { id: req.user.id },
                    { $push: { postList: postNum + 1 } },
                    (error, result) => {
                        if (error) { return console.log(error) };
                    });
                });
        });
        res.status(200).send();
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});


module.exports = router;