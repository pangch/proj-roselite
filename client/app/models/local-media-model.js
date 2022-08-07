import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import LocalMediaController from "../services/rtc/local-media-controller.js";

const logger = createLogger("LocalMediaModel");

class LocalMediaModel extends Observable {
  isActive = false;
  videoElement = null;
  localController = null;

  setVideoElement(videoElement) {
    if (videoElement == null) {
      logger.error("Cannot set videoElement because passed in value is null");
      return;
    }
    if (this.videoElement != null) {
      logger.error("Cannot set videoElement because it is not empty.");
      return;
    }

    this.videoElement = videoElement;
  }

  clearVideoElement() {
    if (this.videoElement == null) {
      logger.error("VideoElement is already empty.");
      return;
    }
    this.videoElement = null;
    this.deactivate();
    this.#cleanupIfNeeded();
  }

  activate() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.emit({ type: "update-active", isActive: this.isActive });
    this.#setup();
  }

  deactivate() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.emit({ type: "update-active", isActive: this.isActive });
    this.#cleanupIfNeeded();
  }

  async #setup() {
    if (this.localController != null) {
      return;
    }
    if (!this.isActive) {
      return;
    }
    if (this.videoElement == null) {
      logger.error("Cannot start local media because video element is empty");
      return;
    }
    logger.info("Starting local media...");
    this.localController = new LocalMediaController(this.videoElement);
    const success = await this.localController.setup();
    if (!success) {
      this.deactivate();
      return;
    }

    this.emit({ type: "stream-ready", stream: this.localController.stream });
  }

  #cleanupIfNeeded() {
    if (this.isActive) {
      return;
    }
    if (this.localController == null) {
      return;
    }
    logger.info("Stopping local media...");
    this.localController.shutdown();
    this.localController = null;
  }
}

const model = new LocalMediaModel();

export function getLocalMediaModel() {
  return model;
}
