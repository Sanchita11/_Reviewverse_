const express = require("express")
const bodyParser = require("body-parser")
const {spawn} = require('child_process')
const { json } = require("body-parser")
const { stringify } = require("qs")

login = false
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
let datatosend = []
let movie_name_send = ''

app.set('view engine','ejs')

app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
    if(login === true){
        res.render("index")
    }else{
        res.redirect('/login')
    }
})

app.post("/",function(req,res){
    movie_name_send = req.body.movie_name
    res.redirect('/search')
})


app.get('/login',function(req,res){
    res.render("login")
})

app.post('/login',function(req,res){
    login = true;
    res.redirect('/')
})

app.get('/search',function(req,res){
    const python = spawn('python',['app.py'])

    python.stdin.write(JSON.stringify(movie_name_send))

    python.stdout.on('data',function(data){
        datatosend=data.toString()
        console.log(datatosend);
    });

    python.on('close',(code)=>{
        if(datatosend.length < 0){
            res.send("No result Found!")
        }
        res.render("search_results",{movie_search : movie_name_send, movies:datatosend})
    })

    console.log(JSON.stringify(movie_name_send))

    python.stdin.end()
})

app.get('/index',function(req,res){
    res.render("index")
})

app.listen(3000,function(){
    console.log("Server is started on port 3000")
})