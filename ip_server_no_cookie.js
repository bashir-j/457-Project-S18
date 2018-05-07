const express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');
var DB_functions = require('./DB_functions');
const app = new express(); 
app.set ('port' , process.env.PORT || 3005);
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com:1883');

client.on('connect', function () {
  client.subscribe('server/myserver');
});

client.on('message', function (topic, message) {
  message = JSON.parse(message.toString());
  DB_functions.get_user_profile(message.uid, function(profile)
{
   DB_functions.set_current_room(message.uid, message.beacon_id);
       DB_functions.get_beacon_data(message.uid, message.beacon_id, function(res)
      {
        console.log(res);
        client.publish(message.uid, JSON.stringify(res));
      });
});


});

app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        next();
    });


app.use(bodyParser.json()); // support json encoded bodies
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

app.listen (app.get( 'port' ), function (){
console.log ('Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' ); });

/**
* @function / routes user to page accordingly -- either the dashboard or the login page
 */
app.get('/', function(request, response){
  console.log('main_redirect');
  if(request.session.uname)
  {
    response.redirect('/dashboard');
  }
  else 
  {
    response.redirect('/login');
  }
});

/**
* @function /login sends back user login html page
 */
app.get('/login', function(request, response){
    //console.log(request);
    console.log('login_req');
   response.sendFile( __dirname +'/login.html');
});

/**
* @function /signup sends user signup html page
 */
app.get('/signup', function(request, response){
    //console.log(request);
    console.log('signup_req');
   response.sendFile( __dirname +'/signup.html');
});

/**
* @function /signup_router - middle route -- sends back status to html page which routes user accordingly - does not render any html page
*/
app.post('/signup_router', function(request, response){
    console.log('signup_router');
    if (request.body.uname && request.body.psw)
    {
      DB_functions.insert_user (request.body.uname, request.body.psw, function(bool)
      {
        if (bool)
          response.sendStatus(200);
        else 
          response.send('invalid_uname'); 
      });
    }
});

/**
* @function /login_router - middle route -- sends back status to html page which routes user accordingly - does not render any html page 
 */
app.post('/login_router', function(request, response){
    //console.log(request);
    if (request.body.uname && request.body.psw)
    {
    DB_functions.authenticate_user(request.body.uname, request.body.psw, function(bool)
    {
      console.log("auth" + bool);
      if (bool == "ok")
      {
        response.send({status: 'authok', 'uid': request.body.uname});
      }
      else 
      {
        if (bool == "!exist"){
          console.log("invalid_uname");
          response.send('invalid_uname'); 
        }
        else {
          console.log("invalid_password");
          response.send('invalid_password');
        }
      }
    });
  }
});

/**
* @function /dashboard - routes user to login page if session timed out, else sends back dashboard html page
 */
app.get('/dashboard', function(request,response){
    if (!request.session.uname)
    {
      response.redirect('login');
    }
    else
    {
      response.sendFile(__dirname +'/dashboard.html');
    }
});

/**
 * @function /request - routes user to login page if session timed out, else sends back  html page
 */
app.get('/request', function(request,response){
   if (!request.session.uname)
    {
      response.redirect('login');
    }
    else
    {
    response.sendFile(__dirname +'/request.html');
    }
})

/**
 * @function /history - routes user to login page if session timed out, else sends back history html page
 */
app.get('/history', function(request,response){
  if (!request.session.uname)
  {
    response.redirect('login');
  }
  else
  {
  response.sendFile(__dirname +'/history.html');
  }
})

/**
* @function /get_me_data - routes user to login page if session timed out, else sends back beacon related data
*/
app.post('/get_me_data', function (request, response) {
// Prepare output in JSON format 
  if (!request.session.uname)
  {
    response.redirect('login');
  }
  else
  {
    DB_functions.get_beacon_data(request.session.uname, request.body.BeaconID, function(data)
    {
      console.log(data);
      response.send(data);
    });
  }

});

/**
 * @function /get_user_history - routes user to login page if session timed out, else sends back user history
 */
app.post('/get_user_history', function(request, response)
{
    console.log("beep");
    DB_functions.get_user_history(request.body.uid, function(history)
    {      

      console.log("history" + history);
      response.send(history);
    });
});

app.get('/currentsession', function(request, response)
{
    response.send(request.session.uname);
});

app.post('/set_current_room', function(request, response)
{
  DB_functions.set_current_room(request.body.uid, request.body.current_room);
  response.sendStatus(200);
});

app.post('/get_current_room', function(request, response)
{
  DB_functions.get_user_profile(request.body.uid, function(profile)
  {
    response.send(profile.current_room);
  })
});

app.post('/push_into_history', function(request, response)
{
  DB_functions.push_into_history(request.body.uid, request.body.art_piece, request.body.description);
});
/**
 * @function /logout - destroys session
 */
app.get('/logout', function(request, response)
{
  request.session.destroy(function(err) {
    if(err) {
    console.log(err);
    } else {
    response.redirect('/');
    }
  });
});

app.use ( express.static ( __dirname));