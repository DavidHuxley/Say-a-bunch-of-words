const express = require('express');
//express 라이브러리 첨부
const app = express();
// const bodyParser = require('body-parser');  
// app.use(bodyParser.urlencoded({extended : true}));  // <body-parser가 2021년부터 express에 기본적으로 포함됨
app.use(express.urlencoded({ extended: true })); // 따라서 원래의 경우엔 사용코드만 적으면 됨
app.use(express.json()); // JSON 데이터 파싱을 위한 미들웨어

const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
require('dotenv').config();


var DB;
MongoClient.connect(process.env.DB_URL, (error, client) => {
        if (error) return console.log(error);
        DB = client.db('TODOAPP');
        app.DB = DB;

        app.listen(process.env.PORT, () => {
            console.log('listening on 8080')
        });
    });
// mongoDB Atlas > Cluster0 > TODOAPP DB 연결

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const flash = require('connect-flash');
app.use(flash());


app.use(session({secret : 'secretCode', resave : true, cookie: { maxAge: 60 * 60 * 1000 } ,saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

// UUID 설정
const { v4 } = require('uuid');
const uuid = () => {
    const tokens = v4().split('-')
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

// multer 라이브러리 세팅
let multer = require('multer');

const path = require('path');
// node.js 내장 라이브러리 path


var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './public/image')
    }, // 업로드한 파일의 경로 설정
    filename : (req, file, cb) => {
        cb(null, `${uuid()}_${file.originalname}`)
    }, // 업로드한 파일 이름을 랜덤하게 설정
}); 

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var ext = path.extname(file.originalname);
    
        if (ext == '.jpg' || ext == '.png' || ext == '.jpeg' || ext == '.gif' || ext == '.webp') {
            req.fileValidationError = null;
            cb(null, true);
        } else {
            cb(new Error('PNG, JPG만 업로드하세요'));
        }
    }, // path를 이용해서 업로드 파일의 확장자가 PNG, JPG 인것만 받음
    limits:{
        fileSize: 10 * 1024 * 1024
    } // 용량 최대 10mb
}); // storage 변수에서 설정한걸 upload 변수에서 쓰겠다고 선언

function sessionCheck(req, res, next){
    if (req.user){
        console.log(req.user);
        next()
    } else {
        res.render('signInUp.ejs', {});
    }
}

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, (inputID, inputPW, done) => {
    DB.collection('USER').findOne({ id: inputID }, (error, result) => {
        if (error) return done(error)

        if (!result) return done(null, false, { message: 'Incorrect username or password.' })
        if (inputPW == result.pw) {
            return done(null, result)
        } else {
            return done(null, false, { message: 'Invalid ID or password' })
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((ID, done) => {
    DB.collection('USER').findOne({ id : ID }, (error, result) => {
        done(null, result)
    })
});

app.use('/', require('./routes/main.js') );

// Sign In
app.get('/entrance', (req, res) => {
    res.render('signInUp.ejs', {});
});

app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/fail'
}), (req, res) => {
    res.redirect('/');
});


app.post('/signup', async (req, res) => {
    try {
      const existingUserEmail = await DB.collection('USER').findOne({email: req.body.email});
      if (existingUserEmail) {
        res.status(409).json({ error:'Duplicate Email' });
        return;
      }
  
      const existingUserId = await DB.collection('USER').findOne({id: req.body.id});
      if (existingUserId) {
        res.status(409).json({ error:'Duplicate ID' });
        return;
      }
  
      await DB.collection('USER').insertOne({
        email: req.body.email,
        id: req.body.id,
        pw: req.body.pw,
        savePosts: []
      });
      res.status(200).send();
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });


// session 없을때 접근시 이동
app.get('/fail', (req, res) => {
    res.send('Sign In Fail')
});


app.get('/mypage', sessionCheck , (req, res) => {
    // console.log(req.user)
    res.render('mypage.ejs', { user : req.user })
})

// 새 글 쓰기 및 목록

app.get('/write', sessionCheck  , (req, res) => {
    res.render('write.ejs', {});
});

app.post('/newpost', sessionCheck  ,(req, res) => {
    // console.log(req.body) // body-parser를 통해서 form 태그, post요청으로 서버에 들어온 정보를 확인
    // console.log(req.body.title)
    // console.log(req.body.content)
    DB.collection('COUNT').findOne({ name:'postNum'}, (error, result) => {
        console.log(result.totalPost);
        var postNum = result.totalPost;
        var writer ={ _id: postNum + 1, title: req.body.title, content: req.body.content, writer : req.user.id };
        
        DB.collection('POST').insertOne( writer , (error, result) => {
                if (error) return console.log(error);
                console.log('save complete');
                res.redirect('/');
                DB.collection('COUNT').updateOne({name:'postNum'}, { $inc: {totalPost: 1}},(error, result) => {
                    if(error){return console.log(error)};
                });
            });
    });
});

// 업로드
app.get('/upload', sessionCheck  , (req, res) => {
    res.render('upload.ejs')
});

app.post('/upload', upload.single('profile') ,(req, res) => {
    res.send("<script>alert('upload complete');location.href='/';</script>");
}) // 업로드 완료시 완료 알람과 함께 페이지 리다이렉트

app.get('')


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