/*
A FIRST TRY TO INTERCONNECT FACEBOOK AND HEROKU
*/

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const async = require('async');
const fetch = require('node-fetch');

/** 
const token = process.env.FB_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
**/
const token = 'Torrecaballeros';
const PAGE_ACCESS_TOKEN = 'EAAV59pTRefYBAEfNZCC6ffB5ZAQzFYGWjdkx65AI2B7iUeEHZC4GCyn0RswUr3Wzf7AqyEFokA34EGaDPTkpdebz64LWu5qlhDqZBLUP7ZBgB3WqqjHqEY1d03Q3EKkh37Ph9CnHUhhaZAFxZAWUjdCQpQZAS4MRvsaWKxxNKBsP1wZDZD';


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
}
);

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          //console.log("Webhook received unknown event: ", event);
          
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  /*
  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));
  */

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
            
            requestUserInfoDraft2(senderID, PAGE_ACCESS_TOKEN)
                  .then((json) => {
                            let msg = 'Hola '+ json.first_name + '\n' + messageText + '\n'; 
                            sendTextMessage(senderID, msg);
                          })
                  .then(() => {
                            //sleep(200000);
                          })
                  .then(() => {
                            sendTextMessage(senderID, messageText);  
                          })
                  .catch((err) => console.log(err));
            
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sleep(delay) {
  return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delay);
  });
}

function requestUserInfoDraft(userId, token){
  const fbGraph = 'https://graph.facebook.com/';
  const fbGraphId = fbGraph + userId + '/';
  const prOut = new Promise((function(resolve, reject){
        request({
                  uri: fbGraphId,
                  qs: { access_token: PAGE_ACCESS_TOKEN },
                  method: 'GET'
                },
          function(err, result, body){
            try{
              // JSON.parse() can throw an exception if not valid JSON
              resolve(JSON.parse(body));
            }
            catch(e){
                reject(e);
            }
          }        
        );
      }
    )
  );
  return prOut;
}

function requestUserInfoDraft2(userId, token){
  const fbGraph = 'https://graph.facebook.com/';
  const fbGraphId = fbGraph + userId + '/';
  const query = {
    uri: fbGraphId,
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'GET'
  }
  return(requestQuery(query));
}  

function requestQuery(query){
  const prOut = new Promise((function(resolve, reject){
      request(query,
        function(err, result, body){
            try{
                // JSON.parse() can throw an exception if not valid JSON
                resolve(JSON.parse(body));
            }
            catch(e){
                reject(e);
            }
        }        
      );
    })
  );
  return prOut;
}



function greetFbId(recipientId, fbToken){
  const fbGraph = 'https://graph.facebook.com/'
  const fbFields = '?&access_token='
  var fQuery = fbGraph + recipientId + fbFields + fbToken;
  fQuery = fbGraph + recipientId + fbFields + fbToken;
  //console.log('query facebook id: ' + fQuery + '\n');
  fetch(fQuery)
      .then(rsp => rsp.json())
      .then(json => {
        if (json.error && json.error.message) {
          throw new Error(json.error.message);
        }
        let msg = 'Hola ' + json.first_name;
        sendTextMessage(recipientId, msg + '\n');
        return json;
      });
}


function logoutUserInfo(userId, token){
  const fbGraph = 'https://graph.facebook.com/'
  const fbFields = '?&access_token='
  var retJson = {}
  var fQuery = fbGraph + userId + fbFields + token;
  fQuery = fbGraph + userId + fbFields + token;
  fetch(fQuery)
      .then(rsp => rsp.json())
      .then(json => {
        if (json.error && json.error.message) {
          throw new Error(json.error.message);
        }
      });
}

function requestUserInfoV0(userId, token){
  const fbGraph = 'https://graph.facebook.com/';
  const fbGraphId = fbGraph + userId + '/';
  request({
    uri: fbGraphId,
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'GET'
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let j = JSON.parse(body);
      console.log(j);
    } else {
      console.error("ERROR QUERYING USER ID");
      console.error(response);
      console.error(error);
    }
  });  
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

function sendTextMessageProm(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  return callSendAPIProm(messageData);
}

function callSendAPIProm(messageData) {
  return new Promise((resolve, reject)=>
    {request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", 
              messageId, recipientId);
            resolve(JSON.parse(body));  
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
            reject(error);
        }
      }
    )  
  })
}


app.listen(app.get('port'), function(){
  console.log('running on port', app.get('port'))
})