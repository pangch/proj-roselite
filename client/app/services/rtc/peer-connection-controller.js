import { createLogger } from "../../../../common/logger.js";
import { getRemoteMediaModel } from "../../models/remote-media-model.js";
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
    if (this.peerConnection != null) {
      logger.error("Already have peer connection when initialzing");
      return;
    }

    this.#initializePeerConnection();
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

    pc.onicecandidate = (event) => this.handleIceCandidate(event);
    pc.ontrack = (event) => this.handleTrack(event);

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

  handleTrack(event) {
    logger.info("Recieved remote track");
    if (this.peerUserId == null) {
      logger.error("Cannot handle remote track as peer user id is null");
      return;
    }

    const videoElement = getRemoteMediaModel().videoElements.get(
      this.peerUserId
    );
    if (videoElement == null) {
      logger.error(
        `Cannot handle remote track because there is no video element for ${this.peerUserId}`
      );
      return;
    }

    logger.info("Setting remote track to video element", event.streams);
    if (videoElement.srcObject != null) {
      logger.info("already set");
      return;
    }
    videoElement.srcObject = event.streams[0];
  }

  handleIceCandidate(event) {
    logger.info(`Handling ICECandidate from RTCPeerConnection`);
    getWSRtcService().signalCandidate(event.candidate);
  }

  async maybeStartCall(userId) {
    if (this.peerConnection == null) {
      logger.info("Ignoring RTC ready because local video is not up");
      return;
    }
    if (this.peerUserId != null) {
      logger.info(
        `Ignoring RTC ready because already in call with ${this.peerUserId}`
      );
      return;
    }
    logger.info(`Attempting to start call with ${userId}`);

    this.peerUserId = userId;

    const pc = this.peerConnection;

    // pc.addTransceiver("video");

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

    getRemoteMediaModel().activateUser(userId);
    const pc = this.peerConnection;

    await pc.setRemoteDescription({ type: "offer", sdp });
    logger.info(`Accepted offer.`);

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
    getRemoteMediaModel().activateUser(userId);

    await pc.setRemoteDescription({ type: "answer", sdp });
    logger.info(`Accepted answer.`);
  }

  async maybeAddIceCandidate(message) {
    const { userId, ...otherData } = message;
    if (this.peerUserId == null) {
      logger.info("Ignoring RTC ICE candidate because not in handshaking.");
    }
    if (this.peerUserId !== userId) {
      logger.info(
        "Ignoring RTC ICE candidate because it is not for current connection"
      );
      return;
    }
    if (this.peerConnection == null) {
      logger.error("No peer connection when adding ice candidate");
      return;
    }
    const pc = this.peerConnection;

    const candidate = { ...otherData, type: "candidate" };
    logger.info("Adding ICE candidate");

    if (candidate.candidate == null) {
      await pc.addIceCandidate(null);
    } else {
      await pc.addIceCandidate(candidate);
    }
  }
}

const peerConnectionController = new PeerConnectionController();

export function getPeerConnectionController() {
  return peerConnectionController;
}
