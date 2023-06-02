const router = require('express').Router();
const luxon = require('luxon');

// model import
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

router.get('/personal', (req, res) => {
    // 로그인한 사용자의 정보를 가져와서 res.data로 응답.
    res.status(200).json({ nickname: req.user.nickname });
});

router.get('/@:nickname', async (req, res) => {
    try {
      const { nickname } = req.params;
      const paramsUser = await User.findOne({ nickname: nickname });
      if (!paramsUser) {
        return res.status(404).send('User not found');
      }
  
      // 해당 유저의 게시글
      const paramsUserPost = await Post.find({ writer: nickname });
  
      // 해당 유저의 bookmarkPosts에서 id 추출
      const bookmarkPostsId = paramsUser.bookmarkPosts;
  
      // 원래 배열 순서 유지하면서 post 컬렉션에서 찾아서 넣어주기
      const bookmarkPosts = await Post.find({ _id: { $in: bookmarkPostsId } });
  
      // 현재 접속 유저
      const cUser = await User.findOne({ nickname: req.user.nickname });
  
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
        const user = await User.findOne({ nickname: nickname });
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
  
      await User.updateOne({ nickname: req.user.nickname }, { $set: { nickname: nickname, emailVisibility: emailView } });
      await Post.updateMany({ writer: req.user.nickname }, { $set: { writer: nickname } });
      await Comment.updateMany({ writer: req.user.nickname }, { $set: { writer: nickname } });
  
      res.status(200).json({ result: true, nickname: nickname });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  router.post('/deleteAccount', async (req, res) => {
    try {
      // POST 컬렉션에서 탈퇴 유저 게시글 삭제상태로 전환
      await Post.updateMany({ writer: req.user.nickname }, { $set: { isDeleted: true } });
      // COMMENT 컬렉션에서 탈퇴 유저 댓글 삭제상태로 전환
      await Comment.updateMany({ writer: req.user.nickname }, { $set: { isDeleted: true } });
      // COMMENT 컬렉션에서 탈퇴 유저의 댓글이 삭제상태로 전환될 때 해당 댓글이 달린 게시물의 id(postId)를 추출해서 JSON 배열로 저장
      const deletedComment = await Comment.find({ writer: req.user.nickname });
      const deletedCommentPostId = deletedComment.map(comment => comment.postId);
      for (let i = 0; i < deletedCommentPostId.length; i++) {
        await Post.updateOne({ _id: deletedCommentPostId[i] }, { $inc: { comment: -1 } });
      }
  
      await User.updateOne({ id: req.user.id }, { $set: { isDeleted: true, deletedAt: luxon.DateTime.local().setZone('Asia/Seoul').toISO() } });
      res.status(200).json({ result: true });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;