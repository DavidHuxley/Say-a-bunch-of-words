const { response } = require('express');
const express = require('express');
//express 라이브러리 첨부
const app = express();

// const bodyParser = require('body-parser');  
// app.use(bodyParser.urlencoded({extended : true}));  // <body-parser가 2021년부터 express에 기본적으로 포함되어있음

app.use(express.urlencoded({ extended: true })); // 따라서 원래의 경우엔 사용코드만 적으면 됨

var DB;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://seokhalidhuxley:seokhalidhuxley23@cluster0.i8k2gcg.mongodb.net/?retryWrites=true&w=majority'
    , (error, client) => {
        if (error) return console.log(error);
        DB = client.db('TODOAPP');

            app.listen(8080, () => {
                console.log('listening on 8080')
            }); //8080 port
        });

app.get('/', (req, response) => {
    response.sendFile(__dirname + '/index.html');
});
// __dirname 은 현재경로로 부터라는 뜻
app.get('/write', (req, response) => {
    response.sendFile(__dirname + '/write.html');
});

app.post('/newpost', (req, response) => {
    response.send('전송완료');
    // console.log(req.body) // body-parser를 통해서 form 태그, post요청으로 서버에 들어온 정보를 확인
    // console.log(req.body.title)
    // console.log(req.body.content)
    DB.collection('POST').insertOne({ 제목: req.body.title, 내용: req.body.content},
         (error, result) => {
        if (error) return console.log(error);
        console.log('저장완료');
    })
    
});