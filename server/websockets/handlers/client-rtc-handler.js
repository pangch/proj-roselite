export default class ClientRtcHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message) {
    try {
      return false;
    } catch (error) {}
    return true;
  }
}
