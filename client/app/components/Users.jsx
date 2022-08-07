import * as React from "react";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useSessionContext, useSessionId } from "../contexts/SessionContext";
import { getSessionModel } from "../models/session-model";
import { useLocalMediaContext } from "../contexts/LocalMediaContext";
import { getLocalMediaModel } from "../models/local-media-model";
import { useIsUserMediaActive } from "../contexts/RemoteMediaContext";

function UserSelfEditor({ user, onDone }) {
  const [name, setName] = useState(user.username);
  const handleDone = () => {
    if (!isEmpty(name)) {
      console.log("Sliced name", name.slice(0, 48));
      getSessionModel().setUsername(name.slice(0, 48));
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

function LocalVideoButton() {
  const { isActive } = useLocalMediaContext();
  const localMediaModel = getLocalMediaModel();

  if (isActive) {
    return (
      <span
        className="icon-button grow-0"
        onClick={() => localMediaModel.deactivate()}
      >
        <i className="fa fa-video-camera" />
        Stop
      </span>
    );
  } else {
    return (
      <span
        className="icon-button grow-0"
        onClick={() => localMediaModel.activate()}
      >
        <i className="fa fa-video-camera" />
        Start
      </span>
    );
  }
}

function UserSelf({ user }) {
  const [isEdit, setIsEdit] = useState(false);
  const { sessionInfo } = useSessionContext();
  const { username } = sessionInfo;
  if (isEdit) {
    return <UserSelfEditor user={user} onDone={() => setIsEdit(false)} />;
  }
  return (
    <li className="user-item self flex items-center">
      <span className="grow basis-0 grow truncate">{username}</span>
      <span className="icon-button grow-0" onClick={() => setIsEdit(true)}>
        <i className="fa fa-pencil" />
        Rename
      </span>
      <LocalVideoButton />
    </li>
  );
}

function UserOther({ user }) {
  return (
    <li className="user-item flex items-center">
      <span className="grow basis-0 grow truncate">{user.username}</span>
    </li>
  );
}

function UserItem({ user }) {
  const id = useSessionId();
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
  const { users, username } = useSessionContext();
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
