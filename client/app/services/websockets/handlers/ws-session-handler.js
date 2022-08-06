import { createLogger } from "../../../../../common/logger.js";
import { getMessagesModel } from "../../../models/messages-model.js";
import { getSessionModel } from "../../../models/session-model.js";

const logger = createLogger("WSUsersHandler");

export default class WSSessionHandler {
  constructor(client) {
    this.client = client;
    this.messagesModel = getMessagesModel();
    this.sessionModel = getSessionModel();
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "identity":
          return this.onIdentity(message);
        case "joined":
          return this.onJoined(message);
        case "left":
          return this.onLeft(message);
        case "user-list":
          return this.onUserList(message);
        case "update-user":
          return this.onUpdateUser(message);
        default:
          return false;
      }
    } catch (error) {
      logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onIdentity(message) {
    const id = message.id;
    this.sessionModel.setSessionId(id);
    logger.info(`Received session ID: ${id}`);
  }

  onJoined(message) {
    this.sessionModel.addUser(message.user);
    this.messagesModel.appendMessage({
      type: "status",
      userId: message.user.id,
      content: `${message.user.username} joined.`,
    });
  }

  onLeft(message) {
    const user = this.sessionModel.getUserFromId(message.id);
    this.sessionModel.removeUser(message.id);

    this.messagesModel.appendMessage({
      type: "status",
      userId: message.id,
      content: `${user.username} left.`,
    });
  }

  onUserList(message) {
    this.sessionModel.updateUserList(message.users);
  }

  onUpdateUser(message) {
    this.sessionModel.updateUser(message.user);
  }
}
