const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: String, // commentId
    postId: String, // comment가 달린 post의 id
    writer: String, // comment 작성자
    content: String, // comment 내용
    time: String, // comment 작성 시간
    like: Number, // comment 좋아요 수
    isDeleted: Boolean // comment 삭제 여부
}, {
    collection: 'COMMENT',
    versionKey: false
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;