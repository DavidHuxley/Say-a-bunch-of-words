const express = require('express');
//express 라이브러리 첨부
const app = express();
// const bodyParser = require('body-parser');  
// app.use(bodyParser.urlencoded({extended : true}));  // <body-parser가 2021년부터 express에 기본적으로 포함되어있음
app.use(express.urlencoded({ extended: true })); // 따라서 원래의 경우엔 사용코드만 적으면 됨
const MongoClient = require('mongodb').MongoClient;
var DB;
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));


MongoClient.connect('mongodb+srv://seokhalidhuxley:seokhalidhuxley23@cluster0.i8k2gcg.mongodb.net/?retryWrites=true&w=majority'
    , (error, client) => {
        if (error) return console.log(error);
        DB = client.db('TODOAPP');

        app.listen(8080, () => {
            console.log('listening on 8080')
        });
    });
// mongoDB Atlas > Cluster0 > TODOAPP DB 연결

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});
app.get('/write', (req, res) => {
    res.render('write.ejs', {});
});

app.get('/list', (req, res) => {

    DB.collection('POST').find().toArray((error, result) => {
        // console.log(result);
        res.render('list.ejs', { TODOs: result });
    }); // POST collection 내의 모든 데이터꺼내고 list.ejs에 랜더링해서 보여줌
});


app.post('/newpost', (req, res) => {
    res.send('transfer complete');
    // console.log(req.body) // body-parser를 통해서 form 태그, post요청으로 서버에 들어온 정보를 확인
    // console.log(req.body.title)
    // console.log(req.body.content)
    DB.collection('COUNT').findOne({ name:'postNum'}, (error, result) => {
        // console.log(result.totalPost);
        var postNum = result.totalPost;

        DB.collection('POST').insertOne({ _id: postNum + 1, title: req.body.title, content: req.body.content },
            (error, result) => {
                if (error) return console.log(error);
                console.log('save complete');
                DB.collection('COUNT').updateOne({name:'postNum'}, { $inc: {totalPost: 1}},(error, result) => {
                    if(error){return console.log(error)};
                });
            });
    });
});

app.delete('/delete', (req, res) => {
    // console.log(req.body)
    req.body._id = parseInt(req.body._id);
    DB.collection('POST').deleteOne(req.body,(error,result) =>{
        console.log('delete complete');
        res.status(200).send();
    });

})

app.get('/detail/:id', (req, res) => {
    DB.collection('POST').findOne({_id : parseInt(req.params.id)}, (error, result) =>{
        // console.log(result);
        if(result === null) {
            res.status(404).send('404 Not Found');
        } else {
            res.render('detail.ejs', { data : result });
        };
    })
})