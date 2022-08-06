import Observable from "../../../common/observable.js";

class MessagesModel extends Observable {
  currentId = 0;

  appendMessage(message) {
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
}

const messagesModel = new MessagesModel();

export function getMessagesModel() {
  return messagesModel;
}
