const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: String, // postId
    title: String, // post 제목(카드앞면내용)
    content: String, // post 내용(카드뒷면내용)
    writer: String, // post 작성자
    img: String, // post 이미지
    time: String, // post 작성 시간
    views: Number,  // post 조회수
    like: Number, // post 좋아요 수
    comment: Number, // post 댓글 수
    bookmarkUsers: Array, // post 북마크한 유저들
    isDeleted: Boolean  // post 삭제 여부
}, {
    collection: 'POST',
    versionKey: false
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;