import * as React from "react";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useSessionContext, useSessionId } from "../contexts/SessionContext";
import { startLocalVideo, stopLocalVideo } from "../services/rtc/local-media";
import { useVideoInfoForUserId } from "../contexts/VideosContext";
import { getSessionModel } from "../models/session-model";

function UserSelfEditor({ user, onDone }) {
  const [name, setName] = useState(user.username);
  const handleDone = () => {
    if (!isEmpty(name)) {
      getSessionModel().setUsername(name.slice(0, 20));
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

function VideoButton({ user }) {
  const videoInfo = useVideoInfoForUserId(user.id);
  if (videoInfo != null) {
    return (
      <span
        className="icon-button grow-0"
        onClick={() => stopLocalVideo(user.id)}
      >
        <i className="fa fa-video-camera" />
        Stop
      </span>
    );
  } else {
    return (
      <span
        className="icon-button grow-0"
        onClick={() => startLocalVideo(user.id)}
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
      <span className="grow basis-0 truncate">
        <span className="truncate">{username}</span>
      </span>
      <span className="icon-button grow-0" onClick={() => setIsEdit(true)}>
        <i className="fa fa-pencil" />
        Rename
      </span>
      <VideoButton user={user} />
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
