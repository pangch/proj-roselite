let username = randomName();

let usersContextDispatch = null;

let userState = {
  username: randomName(),
  users: [],
};

function randomName() {
  const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const charactersLength = CHARACTERS.length;
  const chars = [];
  for (let i = 0; i < 8; i++) {
    chars[i] = CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }
  return chars.join("");
}

export function setUsersContextDispatch(dispatch) {
  usersContextDispatch = dispatch;
}

export function getUserState() {
  return userState;
}

export function updateUserList(users) {
  userState = {
    ...userState,
    users,
  };

  if (usersContextDispatch != null) {
    usersContextDispatch({ type: "update" });
  }
}

export function addUser(newUser) {
  if (userState.users.find((user) => user.id === newUser.id)) {
    return;
  }
  const newUsers = [...userState.users, newUser];
  updateUserList(newUsers);
}

export function removeUser(userID) {
  if (userState.users.find((user) => user.id === userID)) {
    const newUsers = userState.users.filter((user) => user.id !== userID);
    updateUserList(newUsers);
  }
}
