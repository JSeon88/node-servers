const Stomp = require("@stomp/stompjs");

const WebSocket = require("ws");
Object.assign(global, { WebSocket });

const client = new Stomp.Client({
  brokerURL: "ws://localhost:9500/ws",
  onConnect: () => {
    client.subscribe("/topic/greetings", (message) =>
      console.log(`Received: ${message.body}`)
    );
    client.publish({ destination: "/topic/greetings", body: "First Message" });
  },
});

client.activate();
