import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import PeerConnectionController from "../services/rtc/peer-connection-controller.js";

const logger = createLogger("RemoteMediaModel");

class RemoteMediaModel extends Observable {
  activeUsers = [];
  videoElements = new Map();

  setVideoElement(userId, videoElement) {
    this.videoElements.set(userId, videoElement);
  }

  clearVideoElement(userId) {
    this.videoElements.delete(userId);
  }

  activateUser(userId) {
    if (this.activeUsers.includes(userId)) {
      return;
    }

    this.activeUsers = [...this.activeUsers, userId];
    this.emit({ type: "update-active-users", activeUsers: this.activeUsers });
  }

  deactivateUser(userId) {
    if (!this.activeUsers.includes(userId)) {
      return;
    }

    this.activeUsers = this.activeUsers.filter((id) => id !== userId);
    this.emit({ type: "update-active-users", activeUsers: this.activeUsers });
  }
}

const model = new RemoteMediaModel();

export function getRemoteMediaModel() {
  return model;
}
