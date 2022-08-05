import * as React from "react";
import { useUsersContext } from "../contexts/UsersContext";

function UserItem({ user }) {
  return <li>{user.username}</li>;
}

function UserList({ users }) {
  return users.map((user) => <UserItem key={user.id} user={user} />);
}

function UserListPlaceholder({ username }) {
  return <li>{username}</li>;
}

export default function Users() {
  const usersState = useUsersContext();
  const { username, users } = usersState;
  return (
    <section className="section-users grow-0">
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
