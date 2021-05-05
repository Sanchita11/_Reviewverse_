const express = require("express")
const bodyParser = require("body-parser")
const {spawn} = require('child_process')
const { json } = require("body-parser")
const { stringify } = require("qs")
const path = require('path')

login = false
const app = express()
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, '/public')));

app.get("/",function(req,res){
    if(login === true){
        res.sendFile(path.join(__dirname, '/app.html'))
    }else{
        res.redirect('/login')
    }
})

app.post("/",function(req,res){

    movie_name_send = req.body.movie_name
    let datatosend = []
    
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
        res.send(datatosend)
    })

    console.log(JSON.stringify(movie_name_send))

    python.stdin.end()
})

app.get('/login',function(req,res){
    res.sendFile(path.join(__dirname, '/login.html'))
})

app.post('/login',function(req,res){
    login = true;
    res.redirect('/')
})

app.get('/search',function(req,res){
    res.sendFile(path.join(__dirname, '/search_results.html'))
})

app.get('/index',function(req,res){
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(3000,function(){
    console.log("Server is started on port 3000")
})