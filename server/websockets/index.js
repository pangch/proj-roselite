import { WebSocketServer } from "ws";

function logger(message) {
  console.log(`[WS] ${message}`);
}

export default async function (server) {
  logger("Initializing WebSocket server");
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    logger("Upgrade");
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit("connection", websocket, request);
    });
  });

  wss.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      logger("Connected");
      websocketConnection.on("message", (message) => {
        logger(`Received message: ${message}`);
        const parsedMessage = JSON.parse(message);
      });
    }
  );

  return wss;
}
