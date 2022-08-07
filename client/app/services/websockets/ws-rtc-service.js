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

  signalOffer(offer) {
    this.client.sendMessage({
      type: "rtc-offer",
      sdp: offer.sdp,
    });
  }
}
