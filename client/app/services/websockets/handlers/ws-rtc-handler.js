import { createLogger } from "../../../../../common/logger.js";
import { getSessionModel } from "../../../models/session-model.js";
import { getPeerConnectionController } from "../../rtc/peer-connection-controller.js";

const logger = createLogger("WSRtcHandler");

export default class WSRtcHandler {
  constructor(client) {
    this.client = client;
    this.sessionModel = getSessionModel();
    this.peerConnectionController = getPeerConnectionController();
  }

  handleMessage(message) {
    console.log("Handling", message);
    try {
      switch (message.type) {
        case "rtc-ready":
          return this.onReady(message);
        case "rtc-candidate":
        case "rtc-offer":
        case "rtc-answer":
        case "rtc-disconnect":

        default:
          return false;
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onReady(message) {
    logger.info(`Received RTC ready: ${message.userId}`);
    this.peerConnectionController.startCallIfPossible(message.userId);
  }
}
