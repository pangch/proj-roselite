import { merge } from "lodash";
import Observable from "../../../common/observable.js";

let users = [];

const usernameMap = new Map();

const usersObservable = new Observable();

export function subscribeUsers(handler) {
  return usersObservable.subscribe(handler);
}

export function getUsers() {
  return users;
}

export function updateUserList(newUsers) {
  users = newUsers;
  users.forEach((user) => {
    usernameMap.set(user.id, user.username);
  });

  usersObservable.emit({ type: "update-usernames", usernames: usernameMap });
  usersObservable.emit({ type: "update-users", users });
}

export function getUserFromId(userId) {
  return users.find((user) => user.id === userId);
}

export function getUserNameFromId(userId) {
  return usernameMap.get(userId);
}

export function addUser(newUser) {
  if (users.find((user) => user.id === newUser.id)) {
    return;
  }
  const newUsers = [...users, newUser];
  usernameMap.set(newUser.id, newUser.username);
  updateUserList(newUsers);
}

export function removeUser(userId) {
  if (users.find((user) => user.id === userId)) {
    const newUsers = users.filter((user) => user.id !== userId);
    updateUserList(newUsers);
  }
}

export function updateUser(newUser) {
  const oldUser = users.find((user) => user.id === newUser.id);
  if (oldUser != null) {
    merge(oldUser, newUser);
    usernameMap.set(newUser.id, newUser.username);
    usersObservable.emit({ type: "update-usernames", usernames: usernameMap });
    usersObservable.emit({ type: "update-users", users });
  }
}
