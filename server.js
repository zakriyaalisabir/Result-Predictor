var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');


var port=process.env.PORT || 9121;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.send('index.html');
});

app.post('/brainsJsPredicterApi',function(req,res){
    console.log(req.body);
    var avg=0;
    var counts=0;
    var myArray=req.body.array;
    var myTarget=req.body.targetClass;
    // var len=req.body.array.length;
    // console.log('len = ',len);
    for (i=0;i<myTarget;i++){
        if(myArray[i]!=null){
            avg=avg+myArray[i];
            counts++;
        }
    }
    if(avg!=0 && counts!=0){
        avg=parseInt(avg/counts);
    }

    console.log('avg = ',avg,'counts = ',counts);

    res.send({avg});

    res.end();
});


app.listen(port,function(){
    console.log('server started running on port # '+port);
});