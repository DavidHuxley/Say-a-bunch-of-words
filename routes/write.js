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
            const currentTime = DateTime.local().toISO();
            var postNum = result.totalPost;
            var writer = {
                _id: (postNum + 1).toString(), // 글 번호
                title: req.body.frontTitle, // 제목
                content: req.body.backContentText, // 내용 
                writer: req.user.nickname, // 작성자
                img: req.body.cardImgUrl, // 이미지경로
                time: currentTime, // 작성 시간
                views: 0, // 조회수
                like: 0, // 좋아요 수
                comment: 0, // 댓글 수
                bookmarkUsers: [], // 북마크한 유저
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
                    { $push: { postList: (postNum + 1).toString() } },
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

router.post('/comment', async (req, res) => {
    try {
        // 댓글 번호 생성
        const commentNumResult = await req.app.DB.collection('COUNT').findOneAndUpdate(
            { name: 'commentNum' },
            { $inc: { totalComment: 1 } },
            { returnDocument: 'after' }
        );
        const commentNum = commentNumResult.value.totalComment;

        // 댓글 쓰기
        const currentTime = DateTime.local().toISO();
        const commentWrite = {
            _id: (commentNum + 1).toString(),
            postId: req.body.id,
            writer: req.user.nickname,
            content: req.body.content,
            time: currentTime,
            like: 0,
            isDeleted: false,
        };
        await req.app.DB.collection('COMMENT').insertOne(commentWrite);

        // 새로작성한 댓글과 해당 댓글 작성자 정보 가져오기
        const [newComment, newCommenter] = await Promise.all([
            req.app.DB.collection('COMMENT').findOne({ _id: commentWrite._id }),
            req.app.DB.collection('USER').findOne({ nickname: req.user.nickname })
        ]);


        // 게시물의 댓글 수 업데이트
        await req.app.DB.collection('POST').updateOne(
            { _id: req.body.id },
            { $inc: { comment: 1 } }
        );
        // 해당 게시물의 댓글 수
        const postCommentCount = await req.app.DB.collection('POST').findOne({ _id: req.body.id });
 
        // 유저 정보에 댓글 ID 추가
        await req.app.DB.collection('USER').updateOne(
            { id: req.user.id },
            { $push: { commentList: (commentNum + 1).toString() } }
        );

        // 변경된 댓글 수 응답 및 댓글 정보 응답
        res.status(200).json({ postCommentCount: postCommentCount.comment, newComment: newComment, newCommenter: newCommenter });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});






module.exports = router;