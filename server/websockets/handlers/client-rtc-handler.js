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
        case "rtc-candidate":
        case "rtc-offer":
        case "rtc-answer":
        case "rtc-disconnect":
          return this.onForwardRtcMessage(message);
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

  onForwardRtcMessage(message) {
    // Append userId and forward the RTC messages to client
    const { toUserId, ...others } = message;
    message = {
      ...others,
      userId: this.client.id,
    };
    if (toUserId != null) {
      logger.info(`Forwarding RTC message to user ${toUserId}.`, message);
      sendMessageToUser(message, toUserId);
    } else {
      logger.info("Forwarding RTC message to everyone.", message);
      sendBroadcast(message, this.client.id);
    }
  }
}
