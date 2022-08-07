import { createLogger } from "../../../../../common/logger.js";
import { getMessagesModel } from "../../../models/messages-model.js";

const logger = createLogger("WSMessagingHandler");

export default class WSMessagingHandler {
  constructor(client) {
    this.client = client;
    this.messagesModel = getMessagesModel();
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "receive-text-message":
          return this.onReceiveTextMessage(message);
        default:
          return false;
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onReceiveTextMessage(message) {
    this.messagesModel.appendNewMessage({
      type: "text",
      userId: message.userId,
      content: message.content,
    });
  }
}
