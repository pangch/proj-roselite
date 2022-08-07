import { createLogger } from "../../../../common/logger.js";
import { getRemoteMediaModel } from "../../models/remote-media-model.js";
import { getSessionModel } from "../../models/session-model.js";
import { getWSRtcService } from "../websockets/index.js";

let logger = createLogger("RemotePeerController");

export default class RemotePeerController {
  pc = null;
  flags = {}; // Flags used for negoatiation

  constructor(userId, videoElement) {
    this.userId = userId;
    this.remoteVideo = videoElement;
  }

  addLocalStream(stream) {
    this.#setupIfNeeded();

    logger.info("Adding local stream");
    for (const track of stream.getTracks()) {
      this.pc.addTrack(track, stream);
    }
  }

  shutdown() {
    if (this.pc != null) {
      this.pc.close();
      this.pc = null;
      this.flags = {};
    }
    getRemoteMediaModel().deactivateUser(this.userId);
  }

  #setupIfNeeded() {
    if (this.pc != null) {
      return;
    }

    logger.info(`Setting up peer connection for ${this.userId}`);

    // determine politeness based on user_id so that it is deterministic on both ends
    this.isPolite = this.userId > getSessionModel().sessionInfo.id;

    this.pc = new RTCPeerConnection();
    this.pc.onicecandidate = (event) => this.handleIceCandidate(event);
    this.pc.ontrack = (event) => this.handleTrack(event);
    this.pc.onnegotiationneeded = async () => {
      await this.handleNegotiationNeeded();
    };
  }

  handleTrack({ track, streams }) {
    logger.info("Received track");
    getRemoteMediaModel().activateUser(this.userId);

    track.onunmute = () => {
      if (this.remoteVideo.srcObject != null) {
        return;
      }
      this.remoteVideo.srcObject = streams[0];
    };
  }

  handleIceCandidate({ candidate }) {
    logger.info("Sending ICE candidate...");
    getWSRtcService()?.sendData(this.userId, { candidate });
  }

  async handleNegotiationNeeded() {
    logger.info("Started making offer...");
    try {
      this.flags.makingOffer = true;
      await this.pc.setLocalDescription();
      getWSRtcService().sendData({ description: this.pc.localDescription });
    } catch (error) {
      logger.error("Error during negotiation", error);
    } finally {
      this.flags.makingOffer = false;
    }
  }

  onReceivedRtcData(data) {
    this.#setupIfNeeded();
    try {
      if (data.description != null) {
        this.onReceivedRtcDescription(data.description);
      } else if (data.candidate != null) {
        this.onReceivedRtcCandidate(data.candidate);
      }
    } catch (error) {
      logger.error("Failed to handle RTC data", error);
    }
  }

  async onReceivedRtcCandidate(candidate) {
    try {
      logger.debug(`Adding ICE candidate for ${this.userId}`);
      await this.pc.addIceCandidate(candidate);
    } catch (error) {
      if (!this.flags.ignoreOffer) {
        throw error;
      } else {
        logger.debug("RTC candidate ignored");
      }
    }
  }

  async onReceivedRtcDescription(description) {
    const readyForOffer =
      !this.flags.makingOffer &&
      (this.pc.signalingState == "stable" || this.flags.isSettingRemoteAnswer);
    const offerCollision = description.type == "offer" && !readyForOffer;

    this.flags.ignoreOffer = !this.isPolite && offerCollision;
    if (this.flags.ignoreOffer) {
      logger.debug("RTC offer ignored");
      return;
    }

    logger.debug(`Setting remote description for ${this.userId}`);
    this.flags.isSettingRemoteAnswer = description.type === "answer";
    await this.pc.setRemoteDescription(description);
    this.flags.isSettingRemoteAnswer = false;

    if (description.type === "offer") {
      await this.pc.setLocalDescription();
      signaling.send({ description: this.pc.localDescription });
    }
  }
}
