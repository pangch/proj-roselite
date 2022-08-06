import { getClients, sendBroadcast } from "../client-controller.js";

export default class ClientSessionHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message) {
    try {
      switch (message.type) {
        case "join":
          return this.onJoin(message);
        case "identity":
          return this.onIdentity(message);
        case "get-users":
          return this.onGetUsers();
        default:
          return false;
      }
    } catch (error) {
      this.client.logger.error(`Failed to handle message: ${message}`, error);
    }
    return true;
  }

  onJoin(message) {
    this.client.info = {
      username: message.username,
      joinedAt: new Date(),
    };
    this.client.sendMessage({
      type: "identity",
      id: this.client.id,
      username: message.username,
    });

    this.onGetUsers();
    sendBroadcast({
      type: "joined",
      user: {
        id: this.client.id,
        username: message.username,
        joinedAt: this.client.info.joinedAt,
      },
    });
  }

  onIdentity(message) {
    this.client.info.username = message.username;
    sendBroadcast({
      type: "update-user",
      user: {
        id: this.client.id,
        ...this.client.info,
      },
    });
  }

  onGetUsers() {
    const users = Array.from(getClients()).map((client) => ({
      id: client.id,
      username: client.info.username,
      joinedAt: client.info.joinedAt,
    }));
    this.client.sendMessage({
      type: "user-list",
      users,
    });
  }
}
