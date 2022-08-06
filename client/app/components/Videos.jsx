import * as React from "react";
import { useRef, useEffect } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { useVideosContext } from "../contexts/VideosContext";
import { removeVideoElement, setVideoElement } from "../models/videos";

function VideoItem({ userId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoElement(userId, videoRef.current);
    return () => {
      removeVideoElement(userId);
    };
  }, [userId]);

  return <video className="video" ref={videoRef}></video>;
}

function VideoContainer({ video }) {
  return (
    <div className="video-container">
      <VideoItem userId={video.userId} />
    </div>
  );
}

export default function Videos() {
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
        <VideoContainer key={video.userId} video={video} />
      ))}
    </section>
  );
}
