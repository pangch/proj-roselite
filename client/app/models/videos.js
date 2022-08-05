import Observable from "../../../common/observable.js";

let videos = [];

const videosObservable = new Observable();

export function subscribeVideos(handler) {
  return videosObservable.subscribe(handler);
}

export function getVideos() {
  return videos;
}
