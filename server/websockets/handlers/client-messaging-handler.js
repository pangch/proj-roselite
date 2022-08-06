import { sendBroadcast } from "../client-controller.js";

export default class ClientMessagingHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "send-text-message":
          return this.onSendTextMessage(message);
        default:
          return false;
      }
    } catch (error) {
      this.client.logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onSendTextMessage(message) {
    sendBroadcast({
      type: "receive-text-message",
      userId: this.client.id,
      content: message.content,
      sentAt: new Date(),
    });
  }
}
