import { createLogger } from "../../../../../common/logger.js";
import { getMessagesModel } from "../../../models/messages-model.js";
import { setSessionId } from "../../../models/session.js";

const logger = createLogger("WSUsersHandler");

import {
  addUser,
  getUserFromId,
  removeUser,
  updateUser,
  updateUserList,
} from "../../../models/users.js";

export default class WSUsersHandler {
  constructor(client) {
    this.client = client;
    this.messagesModel = getMessagesModel();
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
    this.id = message.id;
    setSessionId(this.id);
    logger.info(`Received session ID: ${this.id}`);
  }

  onJoined(message) {
    addUser(message.user);
    this.messagesModel.appendMessage({
      type: "status",
      userId: message.user.id,
      content: `${message.user.username} joined.`,
    });
  }

  onLeft(message) {
    const user = getUserFromId(message.id);
    removeUser(message.id);

    this.messagesModel.appendMessage({
      type: "status",
      userId: message.id,
      content: `${user.username} left.`,
    });
  }

  onUserList(message) {
    updateUserList(message.users);
  }

  onUpdateUser(message) {
    updateUser(message.user);
  }
}
