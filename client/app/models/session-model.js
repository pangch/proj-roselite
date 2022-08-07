import { range, isEmpty, merge } from "lodash";
import { getWSService } from "../services/websockets/index.js";
import Observable from "../../../common/observable.js";

function randomName() {
  const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const CHARACTERS_LENGTH = CHARACTERS.length;

  return range(8)
    .map(() => CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS_LENGTH)))
    .join("");
}

class SessionModel extends Observable {
  constructor() {
    super();

    let username = localStorage.getItem("username");
    if (isEmpty(username)) {
      username = randomName();
    }

    this.sessionInfo = {
      id: null,
      username,
    };
    this.users = [];
    this.usernames = new Map();
  }

  setSessionId(newId) {
    this.sessionInfo.id = newId;
    this.emit({ type: "update-session-info", sessionInfo: this.sessionInfo });
  }

  setUsername(newUsername) {
    if (isEmpty(newUsername)) {
      return;
    }

    this.sessionInfo.username = newUsername;
    localStorage.setItem("username", newUsername);
    this.emit({ type: "update-session-info", sessionInfo: this.sessionInfo });

    const ws = getWSService();
    ws?.notifyUsername(newUsername);
  }

  getUserFromId(userId) {
    return this.users.find((user) => user.id === userId);
  }

  updateUserList(newUsers) {
    this.users = newUsers;
    this.users.forEach((user) => {
      this.usernames.set(user.id, user.username);
    });

    this.emit({ type: "update-usernames", usernames: this.usernames });
    this.emit({ type: "update-users", users: this.users });
  }

  addUser(newUser) {
    if (this.users.find((user) => user.id === newUser.id)) {
      return;
    }
    const newUsers = [...this.users, newUser];
    this.usernames.set(newUser.id, newUser.username);
    this.updateUserList(newUsers);
  }

  removeUser(userId) {
    if (this.users.find((user) => user.id === userId)) {
      const newUsers = this.users.filter((user) => user.id !== userId);
      this.updateUserList(newUsers);
    }
  }

  updateUser(newUser) {
    const oldUser = this.users.find((user) => user.id === newUser.id);
    if (oldUser != null) {
      merge(oldUser, newUser);
      this.usernames.set(newUser.id, newUser.username);
      this.emit({
        type: "update-usernames",
        usernames: this.usernames,
      });
      this.emit({ type: "update-users", users: this.users });
    }
  }
}

const model = new SessionModel();

export function getSessionModel() {
  return model;
}
