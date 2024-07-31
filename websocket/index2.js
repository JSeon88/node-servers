const WebSocket = require("ws");

// 웹소켓 서버 인스턴스 생성
const wss = new WebSocket.Server({ port: 9500 });

wss.on("connection", function connection(ws) {
  console.log("A new client connected.");

  // 클라이언트로부터 메시지를 받을 때의 이벤트
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    // 모든 클라이언트에 메시지를 에코
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 연결이 종료될 때의 이벤트
  ws.on("close", () => {
    console.log("A client disconnected");
  });

  // 새로 연결된 클라이언트에게 환영 메시지 전송
  ws.send("Welcome to the WebSocket server!");

  // 새로 연결된 클라이언트에게 환영 메시지 전송
  ws.send("Welcome to the WebSocket server!");

  // 5초마다 메시지를 보내는 로직
  const intervalId = setInterval(() => {
    console.log("인터벌 시작");
    if (ws.readyState === WebSocket.OPEN) {
      console.log("전송");
      ws.send("Hello from the server!");
    }
  }, 5000);

  // 연결이 종료될 때 clearInterval로 타이머 해제
  ws.on("close", () => {
    clearInterval(intervalId);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
