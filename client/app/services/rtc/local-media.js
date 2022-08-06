import { createLogger } from "../../../../common/logger.js";
import {
  disableVideoForUserId,
  enableVideoForUserId,
  getVideoElementForUserId,
  subscribeVideos,
} from "../../models/videos.js";

let localMediaController = null;

let logger = createLogger("LocalMedia");

let constraints = {
  audio: true,
  video: true,
};

class LocalMediaController {
  constructor(userId) {
    this.isActive = false;
    this.userId = userId;
    this.videoElement = getVideoElementForUserId(userId);

    this.unsubscribeVideos = subscribeVideos((action) =>
      this.handleLocalMediaEvents(action)
    );

    this.startIfReady();
  }

  async startIfReady() {
    if (this.isActive) {
      return;
    }
    if (this.userId == null || this.videoElement == null) {
      return;
    }

    this.isActive = true;
    try {
      console.log(navigator);
      console.log(navigator.mediaDevices);
      console.log(navigator.mediaDevices.getUserMedia);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTracks = stream.getVideoTracks();
      logger.info(
        `Obtained local video tracks from device: ${videoTracks[0].label}`
      );
      this.videoElement.srcObject = stream;
    } catch (error) {
      this.isActive = false;

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
    }
  }

  stop() {
    this.cleanup();
  }

  cleanup() {
    this.unsubscribeVideos();
  }

  handleLocalMediaEvents(action) {
    switch (action?.type) {
      case "set-video-element":
        if (action.userId === this.userId) {
          this.videoElement = action.element;
          this.startIfReady();
        }
        break;
      case "delete-video-element":
        if (action.userId === this.userId) {
          this.stop();
        }
        break;
    }
  }
}

export function startLocalVideo(userId) {
  enableVideoForUserId(userId);

  if (localMediaController != null) {
    return;
  }

  localMediaController = new LocalMediaController(userId);
}

export function stopLocalVideo(userId) {
  disableVideoForUserId(userId);

  if (localMediaController == null) {
    return;
  }

  localMediaController.stop();
  localMediaController = null;
}
