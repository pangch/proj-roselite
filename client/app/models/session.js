import { range, isEmpty } from "lodash";
import Observable from "../../../common/observable.js";
import { getWSService } from "../services/websockets/index.js";

let sessionInfo = initSessionInfo();

const sessionObservable = new Observable();

export function subscribeSession(handler) {
  return sessionObservable.subscribe(handler);
}

function initSessionInfo() {
  let username = localStorage.getItem("username");

  if (isEmpty(username)) {
    username = randomName();
  }

  return {
    id: null,
    username,
  };
}

function randomName() {
  const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const CHARACTERS_LENGTH = CHARACTERS.length;

  return range(8)
    .map(() => CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS_LENGTH)))
    .join("");
}

export function setSessionId(newId) {
  sessionInfo.id = newId;
  sessionObservable.emit({ type: "update-id", id: newId });
}

export function setUsername(newUsername) {
  if (isEmpty(newUsername)) {
    return;
  }

  sessionInfo.username = newUsername;
  localStorage.setItem("username", newUsername);
  sessionObservable.emit({ type: "update" });

  const ws = getWSService();
  ws?.notifyUsername(newUsername);
}

export function getSessionId() {
  return sessionInfo.id;
}

export function getSessionInfo() {
  return sessionInfo;
}
