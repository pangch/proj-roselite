import * as React from "react";
import { useRef, useEffect } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { useVideosContext } from "../contexts/VideosContext";
import { removeVideoElement, setVideoElement } from "../models/videos";

function RemoteVideoItem({ userId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoElement(userId, videoRef.current);
    return () => {
      removeVideoElement(userId);
    };
  }, [userId]);

  return <video className="video" ref={videoRef} autoPlay playsInline />;
}

function RemoteVideoContainer({ video }) {
  return (
    <div className="video-container">
      <RemoteVideoItem userId={video.userId} />
    </div>
  );
}

export default function RemoteMedia() {
  const { videos } = useVideosContext();
  return (
    <section
      className={classNames(
        "section-videos",
        "flex",
        "flex-wrap",
        isEmpty(videos) && "hidden"
      )}
    >
      {videos.map((video) => (
        <RemoteVideoContainer key={video.userId} video={video} />
      ))}
    </section>
  );
}
