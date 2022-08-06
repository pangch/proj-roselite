import WebSocket from "ws";
import { createLogger } from "../../common/logger.js";
import ClientMessagingHandler from "./handlers/client-messaging-handler.js";
import ClientRtcHandler from "./handlers/client-rtc-handler.js";
import ClientSessionHandler from "./handlers/client-session-handler.js";

const logger = createLogger("ClientController");

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

export default class ClientController {
  constructor(id, socket, request) {
    this.id = id;
    this.info = {};

    this.socket = socket;
    this.request = request;
    this.logger = createLogger(`ClientController:${id}`);

    this.logger.info("Client connected");
    clients.set(id, this);

    socket.on("message", (message) => this.handleMessage(message));
    socket.on("error", (error) => this.handleError(error));
    socket.on("close", () => this.handleClose());

    this.handlers = [
      new ClientSessionHandler(this),
      new ClientMessagingHandler(this),
      new ClientRtcHandler(this),
    ];
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
      this.handlers.find(
        (handler) => handler.handleMessage(parsedMessage) !== false
      );
    } catch (error) {
      this.logger.error(`Failed to handle message: ${message}`, error);
    }
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }
      this.socket.send(message);
    }
  }
}
