export default class WSRtcService {
  constructor(client) {
    this.client = client;
  }

  signalReady() {
    this.client.sendMessage({
      type: "rtc-ready",
    });
  }

  signalCandidate(candidate) {
    this.client.sendMessage({
      type: "rtc-candidate",
      candidate: candidate.candidate,
      sdpMid: candidate.sdpMid,
      sdpMLineIndex: e.candidate.sdpMLineIndex,
    });
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
