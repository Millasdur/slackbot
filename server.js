const express = require('express');
const bodyParser = require('body-parser');
const agent = require('superagent');
require('./config')

const app = express();
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());


function sendMessage(message, payload){
  return agent.post('https://slack.com/api/chat.postMessage')
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer ' + process.env.SLACK_TOKEN)
    .send({token: process.env.SLACK_TOKEN, channel: payload.event.channel, text:"Ceci est un test"})
}

app.use('/', (request, response) =>{
  response.send(request.body.challenge);
  response.status(200);
  let payload = request.body;
  console.log(payload);
  if (payload.event.type === 'app_mention'){
    if (payload.event.text.includes('onjour')){
      response_text = 'Bonjour !'
    }
    else {
      response_text = 'Ceci est un message par default'
    }
      sendMessage('Ceci est un message par default', payload)
        .then(res => {
          console.log('Sending response');
        })
        .catch(err =>{
          console.log(err);
        })
  }
  if (payload.event.type === 'team_join'){
    agent.post('https://slack.com/api/chat.postMessage')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + process.env.SLACK_TOKEN)
      .send(`{"token":"${process.env.SLACK_TOKEN}", "channel":"${payload.event.user.id}", "text":"Bienvenue !"}`)
      .then(res => {
        console.log('Sending response');
      })
      .catch(err =>{
        console.log(err);
        console.log('Something went wrong')
      })
  }
})

app.listen(app.get('port'), () => {
  console.log('Server running in port 5000');
})
