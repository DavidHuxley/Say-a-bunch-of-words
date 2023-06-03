const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));
app.use(methodOverride('_method'));
dotenv.config();

// Mongoose connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log('Server listening on a custom port');
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error);
    });

// model import
const User = require('./models/user');


// 로그인 관련 라이브러리
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    cookie: { maxAge: 60 * 60 * 1000 },
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// 로그인 설정
passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, async (inputID, inputPW, done) => {
    try {
        const idToLowerCase = inputID.toLowerCase();
        const user = await User.findOne({ id: idToLowerCase });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

        // 비밀번호 검증
        const pwMatch = await bcrypt.compare(inputPW, user.pw);
        if (!pwMatch) {
            return done(null, false, { message: 'Invalid ID or password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));
// 로그인 성공시 세션에 저장
passport.serializeUser((user, done) => {
    done(null, user.id)
});
// 로그인 성공시 세션에 저장된 정보를 가져옴
passport.deserializeUser(async (ID, done) => {
    try {
        const user = await User.findOne({ id: ID });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// 세션 체크
function sessionCheck(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('signInUp.ejs');
    }
}


// 로그인 및 회원가입 라우터
const signInUpRouter = require('./routes/signInUp.js');
// 메인페이지 라우터
const mainRouter = require('./routes/main.js');
// 업로드 라우터
const uploadRouter = require('./routes/upload.js');
// 글작성 라우터
const writeRouter = require('./routes/write.js');
// 로그아웃 라우터
const logoutRouter = require('./routes/logout.js');
// 검색창 라우터
const searchRouter = require('./routes/search.js');
// 글 상세페이지 라우터
const detailRouter = require('./routes/detail.js');
// 좋아요 및 저장 라우터
const upDownRouter = require('./routes/upDown.js');
// 글, 댓글 삭제 라우터
const deleteRouter = require('./routes/delete.js');
// 개인페이지 라우터 (회원탈퇴 포함)
const personalRouter = require('./routes/personal.js');

// 라우터 연결
app.use('/', signInUpRouter);
app.use('/', sessionCheck, mainRouter);
app.use('/', sessionCheck, uploadRouter);
app.use('/', sessionCheck, writeRouter);
app.use('/', sessionCheck, logoutRouter);
app.use('/', sessionCheck, searchRouter);
app.use('/', sessionCheck, detailRouter);
app.use('/', sessionCheck, upDownRouter);
app.use('/', sessionCheck, deleteRouter);
app.use('/', sessionCheck, personalRouter);