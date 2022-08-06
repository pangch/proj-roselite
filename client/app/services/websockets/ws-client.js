import { createLogger } from "../../../../common/logger.js";
import { getMessagesModel } from "../../models/messages-model.js";
import { getSessionInfo, setSessionId } from "../../models/session.js";

const logger = createLogger("WSClient");

import {
  addUser,
  getUserFromId,
  removeUser,
  updateUser,
  updateUserList,
} from "../../models/users.js";
import WSService from "./ws-service.js";

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const server = `${protocol}//${window.location.host}`;

export default class WSClient {
  constructor() {
    logger.info(`Connecting to WebSocket server: ${server}`);

    this.socket = new WebSocket(server);
    this.service = new WSService(this);

    this.socket.addEventListener("open", (event) => this.handleOpen(event));
    this.socket.addEventListener("close", (event) => this.handleClose(event));
    this.socket.addEventListener("error", (event) => this.handleError(event));
    this.socket.addEventListener("message", (event) =>
      this.handleMessage(event)
    );

    this.messagesModel = getMessagesModel();
  }

  handleOpen(event) {
    logger.info("Connection established");
    const sessionInfo = getSessionInfo();
    const { username } = sessionInfo;
    this.sendMessage({
      type: "join",
      username,
    });
  }

  handleMessage(event) {
    const message = event.data;
    logger.debug(`Received message: ${message}`);

    try {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage.type) {
        case "identity":
          return this.onIdentity(parsedMessage);
        case "joined":
          return this.onJoined(parsedMessage);
        case "left":
          return this.onLeft(parsedMessage);
        case "user-list":
          return this.onUserList(parsedMessage);
        case "update-user":
          return this.onUpdateUser(parsedMessage);
        case "receive-text-message":
          return this.onReceiveTextMessage(parsedMessage);
        default:
          logger.warn(`Unhandled message: ${message}`);
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
  }

  handleError(error) {
    logger.error("WebSocket connection error.", error);
  }

  handleClose(event) {
    if (event.wasClean) {
      logger.info(
        `Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      logger.info("Connection died");
    }
  }

  sendMessage(message) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }
    this.socket.send(message);
  }

  onIdentity(message) {
    this.id = message.id;
    setSessionId(this.id);
    logger.info(`Received session ID: ${this.id}`);
  }

  onJoined(message) {
    addUser(message.user);
    this.messagesModel.appendMessage({
      type: "status",
      userId: message.user.id,
      content: `${message.user.username} joined.`,
    });
  }

  onLeft(message) {
    const user = getUserFromId(message.id);
    removeUser(message.id);

    this.messagesModel.appendMessage({
      type: "status",
      userId: message.id,
      content: `${user.username} left.`,
    });
  }

  onUserList(message) {
    updateUserList(message.users);
  }

  onUpdateUser(message) {
    updateUser(message.user);
  }

  onReceiveTextMessage(message) {
    this.messagesModel.appendMessage({
      type: "text",
      userId: message.userId,
      content: message.content,
    });
  }
}
