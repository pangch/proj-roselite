import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import RemotePeerController from "../services/rtc/remote-peer-controller.js";
import { getLocalMediaModel } from "./local-media-model.js";
import { getSessionModel } from "./session-model.js";

const logger = createLogger("RemoteMediaModel");

class RemoteMediaModel extends Observable {
  activeUsers = [];
  videoElements = new Map();
  remoteControllers = new Map();

  constructor() {
    super();

    const localMediaModel = getLocalMediaModel();
    localMediaModel.subscribe((action) => this.handleLocalMediaEvents(action));
  }

  handleLocalMediaEvents(action) {
    if (action?.type === "stream-ready") {
      const stream = action.stream;
      for (const remoteController of this.remoteControllers.values()) {
        remoteController.addLocalStream(stream);
      }
    }
  }

  setVideoElement(userId, videoElement) {
    this.videoElements.set(userId, videoElement);

    this.remoteControllers.set(
      userId,
      new RemotePeerController(userId, videoElement)
    );
  }

  clearVideoElement(userId) {
    this.videoElements.delete(userId);

    const remoteController = this.remoteControllers.get(userId);
    if (remoteController != null) {
      this.remoteControllers.delete(userId);
      remoteController.shutdown();
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
