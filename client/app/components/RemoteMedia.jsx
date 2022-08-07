import * as React from "react";
import { useRef, useEffect } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import {
  useIsUserMediaActive,
  useRemoteMediaContext,
} from "../contexts/RemoteMediaContext";
import { useOtherUsers } from "../contexts/SessionContext";
import { getRemoteMediaModel } from "../models/remote-media-model";

function RemoteVideoItem({ userId }) {
  const videoRef = useRef(null);

  const remoteMediaModel = getRemoteMediaModel();
  useEffect(() => {
    remoteMediaModel.setVideoElement(userId, videoRef.current);
    return () => {
      remoteMediaModel.clearVideoElement(userId);
    };
  }, [userId]);

  return <video className="video" ref={videoRef} autoPlay playsInline />;
}

function RemoteVideoContainer({ user }) {
  const isActive = useIsUserMediaActive();
  return (
    <div className={classNames("video-container", !isActive && "hidden")}>
      <RemoteVideoItem userId={user.userId} />
    </div>
  );
}

export default function RemoteMedia() {
  const { activeUsers } = useRemoteMediaContext();
  const otherUsers = useOtherUsers();

  return (
    <section
      className={classNames(
        "section-remote-videos",
        "flex",
        "flex-wrap",
        isEmpty(activeUsers) && "hidden"
      )}
    >
      {otherUsers.map((user) => (
        <RemoteVideoContainer key={user.id} user={user} />
      ))}
    </section>
  );
}
