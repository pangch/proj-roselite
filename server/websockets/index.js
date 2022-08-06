import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";

import { createLogger } from "../../common/logger.js";
import ClientController from "./client-controller.js";
import { addHeartbeat, startHeartbeat, stopHeartbeat } from "./heartbeat.js";

const logger = createLogger("WebSocket");

export default async function (server) {
  logger.info("Initializing WebSocket server");
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    logger.info("Client attempting to upgrade");
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit("connection", websocket, request);
    });
  });

  wss.on("connection", function connection(websocket, request) {
    const id = uuid();
    const client = new ClientController(id, websocket, request);
    addHeartbeat(client);
  });

  wss.on("close", () => stopHeartbeat());

  startHeartbeat(wss);

  return wss;
}
