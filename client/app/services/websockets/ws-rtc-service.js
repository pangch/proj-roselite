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

  notifyReady() {
    this.client.sendMessage({
      type: "rtc-ready",
    });
  }

  notifyDisconnect() {
    this.client.sendMessage({
      type: "rtc-disconnect",
    });
  }
}
