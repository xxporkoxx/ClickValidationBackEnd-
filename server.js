var express = require('express')
  , http = require('http');
//make sure you keep this order
var app = express();
var server = http.createServer(app);
    global.io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var routes     = require('./routes');

var mongoose = require("mongoose");

mongoURI = 'mongodb://localhost/restdb';
mongoose.connect(process.env.MONGODB_URI || mongoURI);

console.log("MONGODB_URI: " +process.env.MONGODB_URI);
console.log("MOGODB_URI: " + process.env.MOGODB_URI);
console.log("MOGO_URI: " + mongoURI);
 
// express app will use body-parser to get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Define a prefix for all routes
// Can define something unique like MyRestAPI
// We'll just leave it so all routes are relative to '/'
app.use('/', routes);

app.set('socketio', io);

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Start server listening on port 8080
server.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});





/*
io.on('connection', function (clientSocket) {
      console.log('\n ===== USER CONNECTED =====\n');

      //Após estabelecer conexão, informamos o cliente
      //que ele está conectado, para então chamar a função connectUser()
      clientSocket.emit("socketConnected");
      
      clientSocket.on("connectUser", function (userJson) {
          var userInfo = {};

          userInfo["socketId"] = clientSocket.id;
          userInfo["userId"] = userJson.userId;
          userInfo["otherUserId"] = userJson.otherUserId;
          userInfo["chatId"] = userJson.chatId;

          console.log("User connected: ");
          console.log(userInfo);
          connectedUsers[userJson.userId] = userInfo;

          clientSocket.emit("userConnected");
      });

      clientSocket.on("disconnectUser", function (userJson) {
          console.log('\n ==== USER DISCONNECTED ====== \n');
          delete connectedUsers[userJson.userId];
          clientSocket.emit('userDisconnected');
      });

      clientSocket.on('disconnect', function () {
          console.log('\n ==== SOCKET DISCONNECTED ====== \n');
          clientSocket.disconnect();
      });

      clientSocket.on('sendMessageTo', function (senderId, message, receiverId, confirmationDate) {
          var request = {};
              request.UserId = senderId;
              request.Content = message.Content;
              request.ToUserId = receiverId;
              request.ChatId = message.ChatId;
              request.MessageType = message.MessageType;

          var senderSocketId = connectedUsers[senderId]["socketId"];

          io.to(senderSocketId).emit('newChatMessage', connectedUsers[senderId]["userId"], msg, currentDateTime, messageConfirmation);
      });

    });
};

*/
