import { createLogger } from "../../../../common/logger.js";

let logger = createLogger("LocalMediaController");

let constraints = {
  audio: true,
  video: true,
};

export default class LocalMediaController {
  constructor(videoElement) {
    this.videoElement = videoElement;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTracks = this.stream.getVideoTracks();
      logger.info(
        `Obtained local video tracks from device: ${videoTracks[0].label}`
      );
      this.videoElement.srcObject = this.stream;
      return true;
    } catch (error) {
      if (error.name === "OverconstrainedError") {
        logger.error(
          "Failed to start local video because of overcontrained",
          error
        );
      } else if (error.name === "NotAllowedError") {
        logger.error(
          "Failed to start local video because permission is not granted"
        );
      } else {
        logger.error("Failed to start local video", error);
      }
      this.cleanup();
      return false;
    }
  }

  stop() {
    if (this.stream != null && this.stream.active) {
      logger.info("Stopping local video stream");
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  cleanup() {
    this.stop();
  }
}
