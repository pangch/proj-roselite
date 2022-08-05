import * as React from "react";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useUsersContext } from "../contexts/UsersContext";
import { useSessionContext } from "../contexts/SessionContext";
import { getSessionInfo, setUsername } from "../utils/session";

function UserSelfEditor({ user, onDone }) {
  const [name, setName] = useState(user.username);
  const handleDone = () => {
    if (!isEmpty(name)) {
      setUsername(name.slice(0, 20));
    }
    onDone();
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleDone();
    }
  };
  return (
    <li className="user-item self flex items-center">
      <input
        className="grow"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={handleDone}
        onKeyPress={handleKeyPress}
      />
    </li>
  );
}

function UserSelf({ user }) {
  const [isEdit, setIsEdit] = useState(false);
  const { username } = getSessionInfo();
  if (isEdit) {
    return <UserSelfEditor user={user} onDone={() => setIsEdit(false)} />;
  }
  return (
    <li className="user-item self flex items-center">
      <span className="grow basis-0 truncate">
        <span className="truncate">{username}</span>
      </span>
      <span className="icon-button grow-0" onClick={() => setIsEdit(true)}>
        <i className="fa fa-pencil" />
        Change
      </span>
    </li>
  );
}

function UserOther({ user }) {
  return (
    <li className="user-item flex items-center basis-0 truncate">
      {user.username}
    </li>
  );
}

function UserItem({ user }) {
  const { id } = useSessionContext();
  const isSelf = id != null && id === user.id;
  if (isSelf) {
    return <UserSelf user={user} />;
  } else {
    return <UserOther user={user} />;
  }
}

function UserList({ users }) {
  return users.map((user) => <UserItem key={user.id} user={user} />);
}

function UserListPlaceholder({ username }) {
  return <li className="user-item">{username}</li>;
}

export default function Users() {
  const users = useUsersContext();
  const { username } = useSessionContext();
  return (
    <section className="section-users grow">
      <ul>
        {users != null && users?.length > 0 ? (
          <UserList users={users} />
        ) : (
          <UserListPlaceholder username={username} />
        )}
      </ul>
    </section>
  );
}
