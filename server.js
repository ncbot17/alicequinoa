var express = require('express');
var app = express();


var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://RicMartinez:RicMartinez@ds161022.mlab.com:61022/quinoadb";
var port = 3000;
var queryRes;
/*
app.get('/', function(req, res){
    res.send('Hello World!');
});

app.get('/test', function(req, res){
    res.send('Hello there!');
});

app.get('/bye', function(req, res){
    res.send('Bye, bye!');
});
*/
/*
MongoClient.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    db.collection("quinColl02").find({}).toArray(function(err, result) {
      if (err) throw err;
      queryRes = result;
      //console.log(result);
      db.close();
    });
  });


app.get('/', function(req, res){
    res.send(queryRes);
});


app.get('/', function(req, res){
    res.send("Hola");
});
*/

app.listen(port, function(){
    console.log("Express app listening on port " + port);
});
