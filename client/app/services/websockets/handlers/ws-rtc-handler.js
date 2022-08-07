import { createLogger } from "../../../../../common/logger.js";
import { getRemoteMediaModel } from "../../../models/remote-media-model.js";
import { getSessionModel } from "../../../models/session-model.js";
import { getPeerConnectionController } from "../../rtc/peer-connection-controller.js";

const logger = createLogger("WSRtcHandler");

export default class WSRtcHandler {
  constructor(client) {
    this.client = client;
    this.sessionModel = getSessionModel();
    this.remoteMediaModel = getRemoteMediaModel();
    this.peerConnectionController = getPeerConnectionController();
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "rtc-relay":
          return this.onRtcRelay(message);
        case "rtc-ready":
          return this.onReady(message);
        case "rtc-offer":
          return this.onOffer(message);
        case "rtc-answer":
          return this.onAnswer(message);
        case "rtc-candidate":
          return this.onCandidate(message);
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
    logger.info(`Received RTC ready from ${message.userId}`);
    this.peerConnectionController.maybeStartCall(message.userId);
  }

  onOffer(message) {
    logger.info(`Received RTC offer from ${message.userId}: \n${message.sdp}`);
    this.peerConnectionController.maybeAcceptOffer(message.userId, message.sdp);
  }

  onAnswer(message) {
    logger.info(`Received RTC answer from ${message.userId}: \n${message.sdp}`);
    this.peerConnectionController.maybeAcceptAnswer(
      message.userId,
      message.sdp
    );
  }

  onCandidate(message) {
    logger.info(`Received RTC candidate from ${message.userId}`);
    this.peerConnectionController.maybeAddIceCandidate(message);
  }

  onDisconnect(message) {
    logger.info(`Received RTC disconnect from ${message.userId}`);
  }
}
