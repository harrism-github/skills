$(document).ready(function () {
  $("header a[href$='javascript/home']").parent().addClass('selected');
  $("article a[href$='javascript/websockets']").parent().addClass('selected');
});

//create a websocket module
var WEBSOCKET = (function($viewPort){
  var wsInterface = {};
  var socket;

  var getSocket = function() {
    return socket;
  };

  var initSocket = function () {
//    if (socket) {
//      socket.disconnect();
//    }
    socket = io.connect('http://localhost:5000');
    socket.on('bcst-msg', function (data) {
      var msg = "";
      switch(data.cmd) {
        case "init":
          msg = "STARTUP: "+data.msg;
          break;
        case "news":
          msg = "NEWS: "+data.msg;
          break;
        case "stop":
          msg = "DISCONNECT: "+data.msg;
          break;
        default:
          msg = data.msg;
      }
      console.log(data);
      writeToViewPort($viewPort, "\n" + msg);
    });

   return socket;
  };

  var disconnectSocket = function() {
    if (socket) {
      socket.disconnect();
      socket = undefined;
      writeToViewPort($viewPort,"\n" +"SHUTDOWN: disconnected from sockets.");
    }
    return socket;
  };

  var writeToViewPort = function ($viewPort, msg) {
    msg = $viewPort.val() + msg;
    $viewPort.val(msg);
  }

  //setup external interface
  wsInterface.getSocket = getSocket;
  wsInterface.initSocket = initSocket;
  wsInterface.disconnectSocket = disconnectSocket;

  return wsInterface;
})($('.view-news'));


var socket = WEBSOCKET.initSocket();

function reportNews() {
  var report = $('.user-input').val();
  WEBSOCKET.getSocket().emit('report',report);
  $('.user-input').val("");
}

function connectToNews() {
  WEBSOCKET.initSocket();
}

function disconnectFromNews() {
  WEBSOCKET.disconnectSocket();
}