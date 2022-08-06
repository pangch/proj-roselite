import { createLogger } from "../../../../../common/logger.js";

const logger = createLogger("WSRtcHandler");

export default class WSRtcHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message) {
    try {
      return false;
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }
}
