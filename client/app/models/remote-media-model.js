import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import RemotePeerController from "../services/rtc/remote-peer-controller.js";
import { getWSRtcService } from "../services/websockets/index.js";
import { getLocalMediaModel } from "./local-media-model.js";
import { getSessionModel } from "./session-model.js";

const logger = createLogger("RemoteMediaModel");

class RemoteMediaModel extends Observable {
  activeUsers = [];
  videoElements = new Map();
  remoteControllers = new Map();
  remoteControllersUnsubscribers = new Map();

  constructor() {
    super();

    const localMediaModel = getLocalMediaModel();
    localMediaModel.subscribe((action) => this.handleLocalMediaEvents(action));

    const sessionModel = getSessionModel();
    sessionModel.subscribe((action) => this.handleSessionModelEvents(action));
  }

  handleSessionModelEvents(action) {
    if (action?.type === "update-users") {
      const toDeactivate = this.activeUsers.filter(
        (user) => action.users.find((u) => u.id === user.id) == null
      );
      toDeactivate.forEach((userId) => {
        this.deactivateUser(userId);
      });
    }
  }

  handleLocalMediaEvents(action) {
    "stream-closed";
    switch (action?.type) {
      case "stream-ready": {
        const stream = action.stream;
        for (const remoteController of this.remoteControllers.values()) {
          remoteController.addLocalStream(stream);
        }
        break;
      }
      case "stream-closed":
        for (const remoteController of this.remoteControllers.values()) {
          remoteController.removeLocalStreamIfNeeded();
        }
        break;
    }
  }

  setVideoElement(userId, videoElement) {
    this.videoElements.set(userId, videoElement);

    const remoteController = new RemotePeerController(userId, videoElement);

    this.remoteControllers.set(userId, remoteController);
    // Relay this action to parent subscriber
    const unsubscribe = remoteController.subscribe((action) =>
      this.emit(action)
    );
    this.remoteControllersUnsubscribers.set(unsubscribe);

    const localMediaModel = getLocalMediaModel();
    const localStream = localMediaModel.localController?.stream;
    if (localMediaModel.isActive && localStream?.active === true) {
      remoteController.addLocalStream(localStream);
      getWSRtcService()?.notifyReady();
    }
  }

  clearVideoElement(userId) {
    this.videoElements.delete(userId);

    const remoteController = this.remoteControllers.get(userId);
    const unsubscriber = this.remoteControllersUnsubscribers.get(userId);
    if (unsubscriber != null) {
      unsubscriber();
      this.remoteControllersUnsubscribers.delete(userId);
    }
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
