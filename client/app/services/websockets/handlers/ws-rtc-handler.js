import { createLogger } from "../../../../../common/logger.js";
import { getRemoteMediaModel } from "../../../models/remote-media-model.js";
import { getSessionModel } from "../../../models/session-model.js";

const logger = createLogger("WSRtcHandler");

export default class WSRtcHandler {
  constructor(client) {
    this.client = client;
    this.sessionModel = getSessionModel();
    this.remoteMediaModel = getRemoteMediaModel();
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "rtc-relay":
          return this.onRtcRelay(message);
        case "rtc-ready":
          return this.onReady(message);
        case "rtc-disconnect":
          return this.onDisconnect(message);
        default:
          return false;
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onRtcRelay(message) {
    const { senderId, data } = message;
    const remoteController =
      this.remoteMediaModel.remoteControllers.get(senderId);

    const type =
      data.candidate != null
        ? "candidate"
        : data.description != null
        ? "description"
        : "message";

    if (remoteController == null) {
      logger.error(
        `Failed to relay RTC ${type} as remote controller does not exist: ${senderId}`
      );
      return;
    }

    logger.debug(`Received RTC ${type} from ${senderId}`);
    remoteController.onReceivedRtcData(data);
  }

  onReady(message) {
    const { senderId } = message;
    logger.info(`Received RTC ready from ${senderId}`);

    this.remoteMediaModel.activateUser(senderId);
  }

  onDisconnect(message) {
    const { senderId } = message;
    logger.info(`Received RTC disconnect from ${senderId}`);

    this.remoteMediaModel.deactivateUser(senderId);
  }
}
