const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String, // 이메일
    id: String, // 아이디
    pw: String, // 비밀번호 (해싱된 값)
    nickname: String, // 닉네임
    profileImg: String, // 프로필 이미지
    isVerified: Boolean, // 이메일 인증 여부
    emailVisibility: Boolean, // 이메일 공개 여부
    postList: Array, // 작성한 post들의 id
    commentList: Array, // 작성한 comment들의 id
    likePosts: Array, // 좋아요한 post들의 id
    likeComments: Array, // 좋아요한 comment들의 id
    bookmarkPosts: Array, // 북마크한 post들의 id
    signUpDate: String, // 가입 날짜
    signInlog: Array, // 로그인 기록
    isDeleted: Boolean // 회원 탈퇴 여부
}, {
    collection: 'USER',
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;

