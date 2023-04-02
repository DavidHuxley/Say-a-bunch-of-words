const express = require('express');
//express 라이브러리 첨부
const app = express();
// const bodyParser = require('body-parser');  
// app.use(bodyParser.urlencoded({extended : true}));  // <body-parser가 2021년부터 express에 기본적으로 포함되어있음
app.use(express.urlencoded({ extended: true })); // 따라서 원래의 경우엔 사용코드만 적으면 됨
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const flash = require('connect-flash');
app.use(flash());

require('dotenv').config();

app.use(session({secret : 'secretCode', resave : true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));



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

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});

// Sign In
app.get('/signin', (req, res) => {
    res.render('signIn.ejs', {});
});
app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/fail'
}), (req, res) => {
    res.redirect('/')
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, (inputID, inputPW, done) => {
    //console.log(inputID, inputPW);
    DB.collection('USER').findOne({ id: inputID }, function (error, result) {
        if (error) return done(error)

        if (!result) return done(null, false, { message: 'ID does not exist' })
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

app.post('/signup', (req, res) => {
    
    DB.collection('USER').insertOne( { id: req.body.id, pw: req.body.pw}, (error, result) => {
        res.redirect('/')
    })
})


app.get('/fail', (req, res) => {
    res.send('Sign In Fail')
});

app.get('/mypage', sessionCheck , (req, res) => {
    // console.log(req.user)
    res.render('mypage.ejs', { user : req.user })
})

function sessionCheck(req, res, next){
    if (req.user){
        next()
    } else {
        res.send('Only members have access rights')
    }
}



// 새 글 쓰기 및 목록

app.get('/write', (req, res) => {
    res.render('write.ejs', {});
});

app.use('/', require('./routes/list.js') );

// app.get('/list', (req, res) => {

//     DB.collection('POST').find().toArray((error, result) => {
//         // console.log(result);
//         res.render('list.ejs', { TODOs: result });
//     }); // POST collection 내의 모든 데이터꺼내고 list.ejs에 랜더링해서 보여줌
// });


app.post('/newpost', (req, res) => {
    // console.log(req.body) // body-parser를 통해서 form 태그, post요청으로 서버에 들어온 정보를 확인
    // console.log(req.body.title)
    // console.log(req.body.content)
    DB.collection('COUNT').findOne({ name:'postNum'}, (error, result) => {
        // console.log(result.totalPost);
        var postNum = result.totalPost;
        var writer ={ _id: postNum + 1, title: req.body.title, content: req.body.content, writer : req.user._id };
        
        DB.collection('POST').insertOne( writer , (error, result) => {
                if (error) return console.log(error);
                console.log('save complete');
                res.redirect('/list');
                DB.collection('COUNT').updateOne({name:'postNum'}, { $inc: {totalPost: 1}},(error, result) => {
                    if(error){return console.log(error)};
                });
            });
    });
});

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

    var deleteData = { _id : req.body._id, writer : req.user._id}

    DB.collection('POST').deleteOne( deleteData ,(error,result) =>{
        console.log('delete complete');
        if (error) {console.log(error)}
        res.status(200).send();
    });

});

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
    DB.collection('POST').updateOne({_id : parseInt(req.body.id)},
     {$set : { title: req.body.title , content: req.body.content }},
     (error, result) => {
        // console.log('complete');
        res.redirect('/list');
    })
})