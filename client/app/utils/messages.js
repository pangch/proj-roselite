import Observable from "../../../common/observable.js";

const messagesObservable = new Observable();

let currentId = 0;

export function subscribeMessages(handler) {
  return messagesObservable.subscribe(handler);
}

export function appendMessage(message) {
  messagesObservable.emit({
    type: "new",
    item: {
      id: currentId++,
      userId: message.userId,
      messageType: message.type,
      content: message.content,
    },
  });
}
