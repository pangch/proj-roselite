import WebSocket from "ws";
import { createLogger } from "../../common/logger.js";

const logger = createLogger("WSClientHandler");

const clients = new Map();

export function getClients() {
  return clients.values();
}

export function sendBroadcast(message) {
  if (typeof message !== "string") {
    message = JSON.stringify(message);
  }
  logger.debug(`Broadcasting message: ${message}`);
  for (let client of clients.values()) {
    client.sendMessage(message);
  }
}

export default class ClientHandler {
  constructor(id, websocket, request) {
    this.id = id;
    this.info = {};

    this.websocket = websocket;
    this.request = request;
    this.logger = createLogger(`WSClientHandler:${id}`);

    this.logger.info("Client connected");
    clients.set(id, this);

    websocket.on("message", (message) => this.handleMessage(message));
    websocket.on("error", (error) => this.handleError(error));
    websocket.on("close", () => this.handleClose());
  }

  handleClose() {
    this.logger.info("Client disconnected");
    clients.delete(this.id);

    sendBroadcast({
      type: "left",
      id: this.id,
    });
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
          return this.onGetUsers();
        case "send-text-message":
          return this.onSendTextMessage(parsedMessage);
        default:
          this.logger.warn(`Unhandled message: ${message}`);
      }
    } catch (error) {
      this.logger.error(`Failed to handle message: ${message}`, error);
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
    this.info = {
      username: message.username,
      joinedAt: new Date(),
    };
    this.sendMessage({
      type: "identity",
      id: this.id,
      username: message.username,
    });

    this.onGetUsers();
    sendBroadcast({
      type: "joined",
      user: {
        id: this.id,
        username: message.username,
        joinedAt: this.info.joinedAt,
      },
    });
  }

  onIdentity(message) {
    this.info.username = message.username;
    sendBroadcast({
      type: "update-user",
      user: {
        id: this.id,
        ...this.info,
      },
    });
  }

  onGetUsers() {
    const users = Array.from(clients.values()).map((client) => ({
      id: client.id,
      username: client.info.username,
      joinedAt: client.info.joinedAt,
    }));
    this.sendMessage({
      type: "user-list",
      users,
    });
  }

  onSendTextMessage(message) {
    sendBroadcast({
      type: "receive-text-message",
      userId: this.id,
      content: message.content,
      sentAt: new Date(),
    });
  }
}