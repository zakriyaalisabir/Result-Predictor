var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');


var port=process.env.PORT || 9121;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.send('index.html');
});


app.listen(port,function(){
    console.log('server started running on port # '+port);
});