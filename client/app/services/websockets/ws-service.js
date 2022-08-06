export default class WSService {
  constructor(client) {
    this.client = client;
  }

  notifyUsername(username) {
    this.client.sendMessage({ type: "identity", username });
  }

  sendTextMessage(content) {
    this.client.sendMessage({ type: "send-text-message", content });
  }
}
