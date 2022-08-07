import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import PeerConnectionController from "../services/rtc/peer-connection-controller.js";

const logger = createLogger("RemoteMediaModel");

class RemoteMediaModel extends Observable {
  activeUsers = [];

  setVideoElement(userId, videoElement) {
    console.log("Set");
  }

  clearVideoElement(userId) {
    console.log("Clear");
  }

  activate() {
    console.log("activate");
  }

  deactivate() {
    console.log("deactivate");
  }
}

const model = new RemoteMediaModel();

export function getRemoteMediaModel() {
  return model;
}
