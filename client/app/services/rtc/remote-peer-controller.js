import { createLogger } from "../../../../common/logger.js";
import { getRemoteMediaModel } from "../../models/remote-media-model.js";
import { getWSRtcService } from "../websockets/index.js";

let logger = createLogger("RemotePeerController");

export default class RemotePeerController {
  peerConnection = null;

  constructor(userId, videoElement) {
    this.userId = userId;
    this.remoteVideo = videoElement;
  }

  setupIfNeeded() {
    if (this.peerConnection != null) {
      return;
    }
    this.peerConnection = new RTCPeerConnection();
    this.peerConnection.onicecandidate = (event) =>
      this.handleIceCandidate(event);
    this.peerConnection.ontrack = (event) => this.handleTrack(event);
  }

  handleTrack({ track, streams }) {
    track.onunmute = () => {
      if (remoteView.srcObject != null) {
        return;
      }
      remoteView.srcObject = streams[0];
    };
  }

  handleIceCandidate({ candidate }) {}

  shutdown() {}
}
