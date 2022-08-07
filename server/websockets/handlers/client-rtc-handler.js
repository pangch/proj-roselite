import { createLogger } from "../../../common/logger.js";
import { sendBroadcast, sendMessageToUser } from "../client-controller.js";

const logger = createLogger("ClientRtcHandler");

export default class ClientRtcHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "rtc-relay":
          return this.onRtcRelay(message);
        case "rtc-ready":
        case "rtc-disconnect":
          return this.onRtcStatus(message);
        default:
          return false;
      }
    } catch (error) {
      this.client.logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onRtcRelay(message) {
    const { recipientId, type, data } = message;

    const rtcType =
      data.candidate != null
        ? "candidate"
        : data.description != null
        ? "description"
        : "message";
    logger.debug(
      `Relaying RTC ${rtcType} from ${this.client.id} to ${recipientId}`
    );
    sendMessageToUser(
      {
        senderId: this.client.id,
        type,
        data,
      },
      recipientId
    );
  }

  onRtcStatus(message) {
    // Append userId and forward the RTC messages to client
    const { recipientId, ...others } = message;
    message = {
      ...others,
      senderId: this.client.id,
    };
    if (recipientId != null) {
      logger.info(`Forwarding RTC status to user ${recipientId}.`, message);
      sendMessageToUser(message, recipientId);
    } else {
      logger.info("Forwarding RTC status to everyone.", message);
      sendBroadcast(message, this.client.id);
    }
  }
}
