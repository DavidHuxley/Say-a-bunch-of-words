const express = require('express'); 
const app = express(); 
app.use(express.urlencoded({ extended: true })); // form 형식의 데이터를 받기 위함
app.use(express.json());  // json 형식의 데이터를 받기 위함

require('dotenv').config();  // .env 파일을 읽어서 process.env 객체에 넣어줌

app.set('view engine', 'ejs'); // ejs 사용을 위한 설정
app.use('/public', express.static('public')); // public 폴더를 static으로 사용
app.use('/assets', express.static('assets')); // assets 폴더를 static으로 사용

const MongoClient = require('mongodb').MongoClient;

let DB;
MongoClient.connect(process.env.DB_URL, (error, client) => {
    if (error) return console.log(error);
    DB = client.db('sbow');
    app.DB = DB;

    app.listen(process.env.PORT, () => {
        console.log('listening on 8080')
    });
});
// mongoDB Atlas > Cluster0 > sbow DB 연결

// put, delete method 사용을 위한 라이브러리
const methodOverride = require('method-override'); 
app.use(methodOverride('_method')); 

// 로그인 관련 라이브러리
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

// 세션 설정
app.use(session({
    secret: 'secretCode',
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
        const user = await DB.collection('USER').findOne({ id: idToLowerCase })
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
passport.deserializeUser((ID, done) => {
    DB.collection('USER').findOne({ id : ID }, (error, result) => {
        done(null, result)
    })
});

// 세션 체크
function sessionCheck(req, res, next){
    if (req.user){
        next();
    } else {
        res.render('signInUp.ejs');
    }
}


const signInUpRouter = require('./routes/signInUp.js');
const mainRouter = require('./routes/main.js');
const uploadRouter = require('./routes/upload.js');
const writeRouter = require('./routes/write.js');
const logoutRouter = require('./routes/logout.js');

app.use('/', signInUpRouter);
app.use('/', sessionCheck, mainRouter);
app.use('/', sessionCheck, uploadRouter);
app.use('/', sessionCheck, writeRouter);
app.use('/', sessionCheck, logoutRouter);

// 새 글 쓰기 및 목록


// 검색
app.get('/search', (req, res) => {
    // console.log(req.query.value);
    var searchReq = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: req.query.value,
              path: ['title', 'content']
            }
          }
        },
        { $sort : { _id : 1 }}
    ] 
    DB.collection('POST').aggregate(searchReq).toArray((error, result) => {
        console.log(result)
        res.render('search.ejs', { TODOs: result , search: req.query.value})
    })
})


// 글 삭제

app.delete('/delete', (req, res) => {
    console.log(req.body)
    req.body._id = parseInt(req.body._id);

    var deleteData = { _id : req.body._id}

    DB.collection('POST').deleteOne( deleteData ,(error,result) =>{
        console.log('delete complete');
        if (error) {console.log(error)}
        res.status(200).send();
    });

});


// 글 상세보기
app.get('/detail/:id', (req, res) => {
    DB.collection('POST').findOne({_id : parseInt(req.params.id)}, (error, result) =>{
        // console.log(result);
        if(result == null) {
            res.status(404).send('404 Not Found');
        } else {
            res.render('detail.ejs', { data : result });
        };
    });
});

// 글 수정

app.get('/edit/:id', (req, res) => {
    DB.collection('POST').findOne({_id : parseInt(req.params.id)}, (error, result) => {
        // console.log(result);
        if(result == null) {
            res.status(404).send('404 Not Found');
        } else {
            res.render('edit.ejs', { data : result});
        }
    });
});

app.put('/edit', (req, res)=> {
    DB.collection('POST').updateOne(
        {_id : parseInt(req.body.id)},
     {$set : { title: req.body.title , content: req.body.content }},
     (error, result) => {
        // console.log('complete');
        res.redirect('/');
    })
})

app.get('/mypage', (req, res) => {
    // console.log(req.user)
    res.render('mypage.ejs', { user : req.user })
})