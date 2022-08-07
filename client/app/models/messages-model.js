import Observable from "../../../common/observable.js";
import { getWSService } from "../services/websockets/index.js";

class MessagesModel extends Observable {
  currentId = 0;

  appendNewMessage(message) {
    this.emit({
      type: "new",
      item: {
        id: this.currentId++,
        userId: message.userId,
        messageType: message.type,
        content: message.content,
      },
    });
  }

  sendTextMessage(text) {
    const ws = getWSService();
    if (ws == null) {
      false;
      return;
    }
    ws.sendTextMessage(text.trim());
    return true;
  }
}

const model = new MessagesModel();

export function getMessagesModel() {
  return model;
}
