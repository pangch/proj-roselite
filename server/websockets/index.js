import { WebSocketServer } from "ws";

export default async function (expressServer) {
  const ws = new WebSocketServer({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    ws.handleUpgrade(request, socket, head, (websocket) => {
      ws.emit("connection", websocket, request);
    });
  });

  ws.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      websocketConnection.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
      });
    }
  );

  return ws;
}
