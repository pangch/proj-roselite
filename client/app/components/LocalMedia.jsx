import * as React from "react";
import { useRef, useEffect } from "react";
import classNames from "classnames";
import { useLocalMediaContext } from "../contexts/LocalMediaContext";
import { getLocalMediaModel } from "../models/local-media-model";

function LocalVideoItem() {
  const videoRef = useRef(null);
  const localMediaModel = getLocalMediaModel();

  useEffect(() => {
    localMediaModel.setVideoElement(videoRef.current);
    return () => {
      localMediaModel.clearVideoElement();
    };
  }, []);

  return <video className="video" ref={videoRef} autoPlay playsInline />;
}

function LocalVideoContainer() {
  return (
    <div className="video-container">
      <LocalVideoItem />
    </div>
  );
}

export default function LocalMedia() {
  const { isActive } = useLocalMediaContext();
  return (
    <section
      className={classNames("section-local-media", { hidden: !isActive })}
    >
      <LocalVideoContainer />
    </section>
  );
}
