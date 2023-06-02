const mongoose = require('mongoose');

const countSchema = new mongoose.Schema({
    name: String, // count 이름
    totalPost: Number, // 총 게시글 수
    totalComment: Number, // 총 댓글 수
    totalCount: Number  // 총 로그인 수
}, {
    collection: 'COUNT',
    versionKey: false
});

const Count = mongoose.model('Count', countSchema);

module.exports = Count;