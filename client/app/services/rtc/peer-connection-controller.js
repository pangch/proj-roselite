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

  handleTrack(event) {
    logger.info("Recieved track");
  }

  handleIceCandidate(candidate) {
    logger.info(
      `Handling ICECandidate from RTCPeerConnection: ${JSON.stringify(
        candidate
      )}`
    );
    getWSRtcService().signalCandidate(candidate);
  }

  async maybeStartCall(userId) {
    if (this.peerUserId != null) {
      logger.info("Ignoring RTC ready because already in call");
      return;
    }
    logger.info(`Attempting to start call with ${userId}`);

    this.peerUserId = userId;
    if (this.peerConnection == null) {
      this.#initializePeerConnection();
    }

    const pc = this.peerConnection;
    const offer = await pc.createOffer();
    logger.info(`Created offer \n${offer.sdp}`);

    getWSRtcService().signalOffer(this.peerUserId, offer);
    await pc.setLocalDescription(offer);
  }

  async maybeAcceptOffer(userId, sdp) {
    if (this.peerUserId != null) {
      logger.info("Ignoring RTC offer because already in call");
      return;
    }

    this.peerUserId = userId;
    if (this.peerConnection == null) {
      this.#initializePeerConnection();
    }

    const pc = this.peerConnection;
    logger.info(`Accepted offer.`);
    await pc.setRemoteDescription({ type: "offer", sdp });

    const answer = await pc.createAnswer();
    logger.info(`Created answer \n${answer.sdp}`);
    getWSRtcService().signalAnswer(this.peerUserId, answer);

    await pc.setLocalDescription(answer);
  }

  async maybeAcceptAnswer(userId, sdp) {
    if (this.peerUserId == null) {
      logger.info("Ignoring RTC answer because not in handshaking.");
    }
    if (this.peerUserId !== userId) {
      logger.info(
        "Ignoring RTC answer because it is not for current connection"
      );
      return;
    }
    if (this.peerConnection == null) {
      logger.error("No peer connection when accepting answer");
      return;
    }

    const pc = this.peerConnection;
    logger.info(`Accepted answer.`);
    await pc.setRemoteDescription({ type: "answer", sdp });
  }
}

const peerConnectionController = new PeerConnectionController();

export function getPeerConnectionController() {
  return peerConnectionController;
}
