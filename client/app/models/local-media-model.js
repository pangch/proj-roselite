import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";
import LocalMediaController from "../services/rtc/local-media-controller.js";

const logger = createLogger("LocalMediaModel");

class LocalMediaModel extends Observable {
  isActive = false;
  videoElement = null;
  localMediaController = null;

  setVideoElement(videoElement) {
    if (videoElement == null) {
      logger.error("Cannot set videoElement because passed in value is null");
    }
    if (this.videoElement != null) {
      logger.error("Cannot set videoElement because it is not empty.");
      return;
    }
    this.videoElement = videoElement;
    this.#setupIfReady();
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
    this.#setupIfReady();
  }

  deactivate() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.emit({ type: "update-active", isActive: this.isActive });
    this.#cleanupIfNeeded();
  }

  async #setupIfReady() {
    if (this.localMediaController != null) {
      return;
    }
    if (!this.isActive || this.videoElement == null) {
      return;
    }
    logger.info("Starting local media...");
    this.localMediaController = new LocalMediaController(this.videoElement);
    const success = await this.localMediaController.start();
    if (!success) {
      this.deactivate();
    }
  }

  #cleanupIfNeeded() {
    if (this.isActive) {
      return;
    }
    if (this.localMediaController == null) {
      return;
    }
    logger.info("Stopping local media...");
    this.localMediaController.cleanup();
    this.localMediaController = null;
  }
}

const model = new LocalMediaModel();

export function getLocalMediaModel() {
  return model;
}
