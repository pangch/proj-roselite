import { createLogger } from "../../../common/logger.js";
import { getSessionInfo, setSessionId } from "../utils/session.js";

import { addUser, removeUser, updateUserList } from "../utils/users.js";

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
  }

  onLeft(message) {
    removeUser(message.id);
  }

  onUserList(message) {
    updateUserList(message.users);
  }
}

export function initWebSocket() {
  if (client == null) {
    client = new WSClient();
  }
}
