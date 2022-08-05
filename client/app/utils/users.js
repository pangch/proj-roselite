import { merge } from "lodash";
import Observable from "../../../common/observable.js";

let users = [];

const usersObservable = new Observable();

export function subscribeUsers(handler) {
  return usersObservable.subscribe(handler);
}

export function getUsers() {
  return users;
}

export function updateUserList(newUsers) {
  users = newUsers;

  usersObservable.emit({ type: "update", users });
}

export function getUserFromId(userId) {
  return users.find((user) => user.id === userId);
}

export function addUser(newUser) {
  if (users.find((user) => user.id === newUser.id)) {
    return;
  }
  const newUsers = [...users, newUser];
  updateUserList(newUsers);
}

export function removeUser(userID) {
  if (users.find((user) => user.id === userID)) {
    const newUsers = users.filter((user) => user.id !== userID);
    updateUserList(newUsers);
  }
}

export function updateUser(newUser) {
  const oldUser = users.find((user) => user.id === newUser.id);
  if (oldUser != null) {
    merge(oldUser, newUser);
    usersObservable.emit({ type: "update", users });
  }
}
