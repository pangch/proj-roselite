import { createLogger } from "../../../../common/logger.js";
import { getWSRtcService } from "../websockets/index.js";

let logger = createLogger("PeerConnectionController");

class PeerConnectionController {
  localMediaController = null;
  peerConnection = null;
  peerUserId = null;

  setLocalMediaController(localMediaController) {
    if (this.localMediaController != null) {
      log.error("Cannot set local media controller as it is not empty");
      return;
    }
    this.localMediaController = localMediaController;
    this.#setupLocal();
  }

  clearLocalMediaController() {
    this.#cleanup();
  }

  #setupLocal() {
    if (this.peerConnection == null) {
      this.#initializePeerConnection();
    }
    const localStream = this.localMediaController.stream;
    if (localStream == null) {
      logger.error("Failed to add local streams to peer connection");
    }
    localStream
      .getTracks()
      .forEach((track) => this.peerConnection.addTrack(track, localStream));

    getWSRtcService().signalReady();
    logger.info("RTCPeerConnection local ready");
  }

  #cleanup() {
    this.localMediaController = null;
    if (this.peerConnection == null) {
      return;
    }

    logger.info("Closing RTCPeerConnection");
    this.peerConnection.close();
    this.peerConnection = null;
  }

  #initializePeerConnection() {
    if (this.peerConnection != null) {
      logger.error("Cannot initialize peer connection as it already exists");
      return;
    }

    logger.info("Creating RTCPeerConnection");
    const pc = new RTCPeerConnection();
    this.peerConnection = pc;

    pc.addEventListener("icecandidate", (event) =>
      this.handleIceCandidate(event.candidate)
    );
    pc.addEventListener("track", (event) => this.handleTrack(event));
    logger.info("RTCPeerConnection created");
  }

  handleTrack(event) {}

  handleIceCandidate(candidate) {
    logger.info(
      `Handling ICECandidate from RTCPeerConnection: ${JSON.stringify(
        candidate
      )}`
    );
    getWSRtcService().signalCandidate(candidate);
  }

  async startCallIfPossible(userId) {
    if (this.peerUserId != null) {
      return;
    }
    logger.info(`Attempting to start call with ${userId}`);
    if (this.peerConnection == null) {
      this.#initializePeerConnection();
    }

    const pc = this.peerConnection;
    const offer = await pc.createOffer();
    logger.info(`Created and signaling offer \n${offer.sdp}`);

    getWSRtcService().signalOffer(offer);
    await pc.setLocalDescription(offer);
  }
}

const peerConnectionController = new PeerConnectionController();

export function getPeerConnectionController() {
  return peerConnectionController;
}
