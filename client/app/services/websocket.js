import { createLogger } from "../../../common/logger.js";
import { appendMessage } from "../utils/messages.js";
import { getSessionInfo, setSessionId } from "../utils/session.js";

import {
  addUser,
  getUserFromId,
  removeUser,
  updateUser,
  updateUserList,
} from "../utils/users.js";

const logger = createLogger("WebSocket");
const server = `ws://${window.location.host}`;

let client = null;

class WSClient {
  constructor() {
    logger.info(`Connecting to WebSocket server: ${server}`);
    const socket = new WebSocket(server);
    this.socket = socket;

    socket.onopen = (event) => this.handleOpen(event);
    socket.onmessage = (event) => this.handleMessage(event);
    socket.onclose = (event) => this.handleClose(event);
    socket.onerror = (error) => this.handleError(error);
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

  handleError(event) {
    logger.error(`Error: ${error.message}`, "error");
  }

  handleClose(event) {
    client = null;
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
    appendMessage({
      type: "status",
      userId: message.user.id,
      content: `${message.user.username} joined.`,
    });
  }

  onLeft(message) {
    const user = getUserFromId(message.id);
    removeUser(message.id);

    appendMessage({
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
    appendMessage({
      type: "text",
      userId: message.userId,
      content: message.content,
    });
  }
}

function requireClient() {
  if (client == null) {
    logger.error("Cannot send WS message because no active connection.");
    return;
  }
  return client;
}

export function notifyUsername(username) {
  requireClient()?.sendMessage({ type: "identity", username });
}

export function sendTextMessage(content) {
  requireClient()?.sendMessage({ type: "send-text-message", content });
}

export function initWebSocket() {
  if (client == null) {
    client = new WSClient();
  }
}
