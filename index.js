/*
A FIRST TRY TO INTERCONNECT FACEBOOK AND HEROKU
*/

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('port', (process.env.port||8300));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', function(req,res){
    console.log('RIC 1');
    res.send('Hello Youtube!');
})

app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] ===
        'my_voice_is_my_password_verify_me'){
            res.send(req.query['hub.challenge']);
        }
    res.send('No entry');
})

app.listen(process.env.port||8000, function(){
    console.log('running on port', app.get('port'));
})
