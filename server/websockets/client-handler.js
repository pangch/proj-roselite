import { createLogger } from "../utils/logger.js";

const logger = createLogger("WSClientHandler");

const clients = new Map();

export function getClients() {
  return clients.values();
}

export function serverBroadcast(message) {
  logger.debug(`Broadcasting message: ${message}`);
  for ([id, handler] of clients) {
    handler.sendMessage(message);
  }
}

export default class ClientHandler {
  constructor(id, websocket, request) {
    this.id = id;
    this.websocket = websocket;
    this.request = request;
    this.logger = createLogger(`WSClientHandler:${id}`);
    console.log("Logger", this.logger);
    this.logger.info("Client connected");
    clients.set(id, this);

    websocket.on("message", (message) => this.handleMessage(message));
    websocket.on("error", (error) => this.handleError(error));
    websocket.on("close", () => this.handleClose());
  }

  handleClose() {
    this.logger.info("Client disconnected");
    clients.delete(this.id);
  }

  handleError(error) {
    this.logger.error("Client error.", error);
  }

  handleMessage(message) {
    this.logger.debug(`Received message: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage.type) {
        case "join":
          return this.onJoin(parsedMessage);
        case "identity":
          return this.onIdentity(parsedMessage);
        case "get-users":
          return this.onGetUsers(parsedMessage);
        default:
          this.logger.warn(`Unhandled message: ${message}`);
      }
    } catch (error) {
      this.logger.error(`Failed to handle message: ${message}`);
    }
  }

  sendMessage(message) {
    if (this.websocket.readyState === WebSocket.OPEN) {
      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }
      this.websocket.send(message);
    }
  }

  onJoin(message) {
    this.username = message.username;

    this.sendMessage({
      type: "joined",
      id: this.id,
    });

    this.onGetUsers();
  }

  onIdentity(message) {}

  onGetUsers(message) {}
}
