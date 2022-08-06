import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";

let videos = [];
const videoElementMap = new Map();

const logger = createLogger("Videos");

const videosObservable = new Observable();

export function subscribeVideos(handler) {
  return videosObservable.subscribe(handler);
}

export function getVideos() {
  return videos;
}

export function setVideoElement(userId, element) {
  if (element == null) {
    logger.error(`Failed to set video element for user: ${userId}`);
  }
  videoElementMap.set(userId, element);

  videosObservable.emit({ type: "set-video-element", userId, element });
}

export function removeVideoElement(userId) {
  videoElementMap.delete(userId);
  videosObservable.emit({ type: "delete-video-element", userId });
}

export function getVideoElementForUserId(userId) {
  return videoElementMap.get(userId);
}

export function enableVideoForUserId(userId) {
  if (videos.find((video) => video.userId === userId)) {
    return;
  }
  videos = [...videos, { userId }];
  logger.info(`Enabling video for ${userId}`);

  videosObservable.emit({ type: "update-videos", videos });
}

export function disableVideoForUserId(userId) {
  if (!videos.find((video) => video.userId === userId)) {
    return;
  }
  videos = videos.filter((video) => video.userId !== userId);
  logger.info(`Disabling video for ${userId}`);

  videosObservable.emit({ type: "update-videos", videos });
}
