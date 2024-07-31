var http = require("http");
var StompServer = require("stomp-broker-js");

var server = http.createServer();
var stompServer = new StompServer({ server: server, path: "/ws" });

server.listen(1234);

stompServer.on("connecting", function (...args) {
  console.log("CONNECTING", ...args);
});

let timer;
stompServer.subscribe("/**", function (msg, headers) {
  var topic = headers.destination;
  console.log("subscribe", { msg, headers });
  // console.log(topic, "->", msg);
});

clearTimeout(timer);

let count = 0;
timer = setInterval(() => {
  stompServer.send("/topic/test01", {}, "testMsg____" + count++);
}, 100);
