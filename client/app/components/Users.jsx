import * as React from "react";
import { useUsersContext } from "../contexts/UsersContext";

import classNames from "classnames";
import { useSessionContext } from "../contexts/SessionContext";

function UserItem({ user }) {
  const { id } = useSessionContext();
  const isSelf = id != null && id === user.id;
  return (
    <li className={classNames(isSelf && "self", "user-item")}>
      {user.username}
    </li>
  );
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
