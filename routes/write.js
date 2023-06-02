const router = require('express').Router();
const { DateTime } = require('luxon');

// model import
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Count = require('../models/count');

// 글쓰기 페이지 렌더링
router.get('/write', async (req, res) => {
    try {
      const user = await User.findOne({ id: req.user.id });
      if (!user) {
        res.status(404).send('404 Not Found');
      } else {
        res.render('write.ejs', { user });
      }
    } catch (error) {
      res.status(500).send('500 Internal Server Error');
    }
  });
  

// 카드내용 서버로 전송
router.post('/newpost', async (req, res) => {
    try {
      const currentTime = DateTime.local().setZone('Asia/Seoul').toISO();
  
      const count = await Count.findOne({ name: 'postNum' }).exec();
      const postNum = count.totalPost;
  
      const postWriter = {
        _id: (postNum + 1).toString(),
        title: req.body.frontTitle,
        content: req.body.backContentText,
        writer: req.user.nickname,
        img: req.body.cardImgUrl,
        time: currentTime,
        views: 0,
        like: 0,
        comment: 0,
        bookmarkUsers: [],
        isDeleted: false,
    };
  
      await Post.create(postWriter);
      await Count.updateOne({ name: 'postNum' }, { $inc: { totalPost: 1 } }).exec();
      await User.updateOne({ id: req.user.id }, { $push: { postList: (postNum + 1).toString() } }).exec();
  
      res.status(200).send();
    } catch (error) {
      res.status(400).send('400 Bad Request');
    }
  });

router.post('/comment', async (req, res) => {
    try {
        // 댓글 번호 생성
        const commentNumResult = await Count.findOneAndUpdate(
            { name: 'commentNum' },
            { $inc: { totalComment: 1 } },
            { new: true }
          );
        const commentNum = commentNumResult.totalComment;

        // 댓글 쓰기
        const currentTime = DateTime.local().setZone('Asia/Seoul').toISO();
        const commentWrite = {
          _id: (commentNum + 1).toString(),
          postId: req.body.id,
          writer: req.user.nickname,
          content: req.body.content,
          time: currentTime,
          like: 0,
          isDeleted: false,
        };
    
        await Comment.create(commentWrite);

        // 새로작성한 댓글과 해당 댓글 작성자 정보 가져오기
        const [newComment, newCommenter] = await Promise.all([
            Comment.findOne({ _id: commentWrite._id }),
            User.findOne({ nickname: req.user.nickname })
          ]);


        // 게시물의 댓글 수 업데이트
        await Post.updateOne({ _id: req.body.id }, { $inc: { comment: 1 } });
        // 해당 게시물의 댓글 수
        const postCommentCount = await Post.findOne({ _id: req.body.id });
 
        // 유저 정보에 댓글 ID 추가
        await User.updateOne({ id: req.user.id }, { $push: { commentList: (commentNum + 1).toString() } });

        // 변경된 댓글 수 응답 및 댓글 정보 응답
        res.status(200).json({ postCommentCount: postCommentCount.comment, newComment: newComment, newCommenter: newCommenter });
    } catch (error) {
        res.status(400).send('400 Bad Request');
    }
});






module.exports = router;