import { merge } from "lodash";

export default class WSRtcService {
  constructor(client) {
    this.client = client;
  }

  sendData(userId, data) {
    this.client.sendMessage({
      type: "rtc-relay",
      recipientId: userId,
      data,
    });
  }

  signalReady() {
    this.client.sendMessage({
      type: "rtc-ready",
    });
  }

  signalCandidate(candidate) {
    const message = {
      type: "rtc-candidate",
      candidate: null,
    };
    if (candidate != null) {
      merge(message, {
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid,
        sdpMLineIndex: candidate.sdpMLineIndex,
      });
    }
    this.client.sendMessage(message);
  }

  signalOffer(userId, offer) {
    this.client.sendMessage({
      type: "rtc-offer",
      toUserId: userId,
      sdp: offer.sdp,
    });
  }

  signalAnswer(userId, answer) {
    this.client.sendMessage({
      type: "rtc-answer",
      toUserId: userId,
      sdp: answer.sdp,
    });
  }
}
