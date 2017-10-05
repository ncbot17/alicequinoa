/*
A FIRST TRY TO INTERCONNECT FACEBOOK AND HEROKU
*/

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

const app = express();
app.set('port', (process.env.PORT||5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.get('/', function(req,res){
    res.send('Hello Youtube!');
})

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge'])        
  }
  res.send('No entry')
});


app.listen(app.get('port'), function(){
  console.log('running on port', app.get('port'))
})