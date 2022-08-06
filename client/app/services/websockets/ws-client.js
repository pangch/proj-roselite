import { createLogger } from "../../../../common/logger.js";
import { getSessionInfo } from "../../models/session.js";
import WSMessagingHandler from "./handlers/ws-messaging-handler.js";
import WSRtcHandler from "./handlers/ws-rtc-handler.js";
import WSUsersHandler from "./handlers/ws-users-handler.js";

const logger = createLogger("WSClient");

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

    this.handlers = [
      new WSUsersHandler(this),
      new WSMessagingHandler(this),
      new WSRtcHandler(this),
    ];
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
      this.handlers.find(
        (handler) => handler.handleMessage(parsedMessage) !== false
      );
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
}
