const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();

// CORS 미들웨어 사용
app.use(cors());

// SSL/TLS 인증서 읽기
const privateKey = fs.readFileSync("privatekey.pem", "utf8");
const certificate = fs.readFileSync("certificate.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// HTTPS 서버 생성
const httpsServer = https.createServer(credentials);
httpsServer.listen(9500);

// WebSocket Server (WSS) 생성
const wss = new WebSocket.Server({ server: httpsServer });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    // STOMP 프레임 처리
    const frame = parseStompFrame(message);
    if (frame) {
      if (frame.command === "SUBSCRIBE") {
        // SUBSCRIBE 메시지에 대한 응답 생성
        const response = createStompFrame("MESSAGE", {
          destination: frame.headers.destination,
        });
        ws.send(response);
      }
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
  });

  // 에러 이벤트 핸들러 등록
  ws.on("error", function error(error) {
    console.error("WebSocket Error:", error);
  });
});

// STOMP 프레임 파싱 함수
function parseStompFrame(data) {
  // 실제 STOMP 프레임 파싱 로직을 구현해야 합니다.
  // 이 예제에서는 간단히 JSON 형식으로 가정합니다.
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing STOMP frame: ", error);
    return null;
  }
}

// STOMP 프레임 생성 함수
function createStompFrame(command, headers) {
  // 실제 STOMP 프레임 생성 로직을 구현해야 합니다.
  // 이 예제에서는 간단히 JSON 형식으로 가정합니다.
  const frame = {
    command,
    headers,
  };
  return JSON.stringify(frame);
}

console.log("WSS server started on wss://localhost:9500");
