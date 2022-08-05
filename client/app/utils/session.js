import { range } from "lodash";
import Observable from "../../../common/observable.js";

let id = null;
let username = randomName();

const sessionObservable = new Observable();

export function subscribeSession(handler) {
  return sessionObservable.subscribe(handler);
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
  id = newId;
  sessionObservable.emit({ type: "update-id", id });
}

export function getSessionId() {
  return id;
}

export function getSessionInfo() {
  return {
    id,
    username,
  };
}
