import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import RemotePeerController from "../services/rtc/remote-peer-controller.js";
import { getSessionModel } from "./session-model.js";

const logger = createLogger("RemoteMediaModel");

class RemoteMediaModel extends Observable {
  activeUsers = [];
  videoElements = new Map();
  remoteControllers = new Map();

  setVideoElement(userId, videoElement) {
    this.videoElements.set(userId, videoElement);

    this.remoteControllers.set(userId, new RemotePeerController(userId));
  }

  clearVideoElement(userId) {
    this.videoElements.delete(userId);

    const remoteController = this.remoteControllers.get(userId);
    if (remoteController != null) {
      remoteController.shutdown();
      this.remoteControllers.delete(userId);
    }
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
