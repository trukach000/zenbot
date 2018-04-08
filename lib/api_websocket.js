module.exports = function api_websocket (conf) {

  var WebSocketServer = require('websocket').server;
var http = require('http');1

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});

var port = 80
server.listen(port, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

var connectionPool = []

console.log(`Start websocket api on ${port}`)
// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  console.log("Got websocket connection request")
  var index = connectionPool.push(connection) - 1;
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  /*connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
    }
  });*/

  connection.on('close', function(connection) {
    // close user connection
    connectionPool.splice(index, 1);
    console.log((new Date()) + " Peer "
    + connection.remoteAddress + " disconnected.");

  });
});

  return {
    send: function (type, data) {
        console.log(`Send websocket action: ${type}: ${data}`)
        connectionPool.forEach((conn) => {
          conn.sendUTF(
            JSON.stringify({ type: type, data: data }));
        })
    }
  }
}
