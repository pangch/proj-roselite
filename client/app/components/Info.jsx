import * as React from "react";
import { useState, useEffect } from "react";
import { useRtcInfoContext } from "../contexts/RtcInfoContext";
import { useUserNameFromId } from "../contexts/SessionContext";
import ShowDetailLink from "./ShowDetailLink";

function RtcDescriptionDetail({ description }) {
  return (
    <div>
      <strong>Type: {description.type}</strong>
      <pre>{description.sdp}</pre>
    </div>
  );
}

function RtcCandidateDetail({ candidates }) {
  return candidates.map((c, index) => (
    <div key={index}>
      <div>SDP Mid: {c.sdpMid}</div>
      <div>SDP MLineIndex: {c.sdpMLineIndex}</div>
      <div>Username Fragment: {c.usernameFragment}</div>
      <div>Candidate: {c.candidate}</div>
      <hr />
    </div>
  ));
}

function RtcInfoBlock({ userId, info }) {
  const userName = useUserNameFromId(userId);

  return (
    <div className="info-block">
      <header>
        RTC {"<->"} {userName}
      </header>
      <div className="info-row">
        <span className="info-name">Local Description</span>
        <span className="info-value">
          {info.localDescription != null ? (
            <ShowDetailLink
              label="Show"
              details={
                <RtcDescriptionDetail description={info.localDescription} />
              }
            />
          ) : (
            "Not Set"
          )}
        </span>
      </div>
      <div className="info-row">
        <span className="info-name">Remote Description</span>
        <span className="info-value">
          {info.remoteDescription != null ? (
            <ShowDetailLink
              label="Show"
              details={
                <RtcDescriptionDetail description={info.remoteDescription} />
              }
            />
          ) : (
            "Not Set"
          )}
        </span>
      </div>
      <div className="info-row">
        <span className="info-name">Local Candidates</span>
        <span className="info-value">
          <ShowDetailLink
            label={`(${info.localCandidates.length})`}
            details={<RtcCandidateDetail candidates={info.localCandidates} />}
          />
        </span>
      </div>
      <div className="info-row">
        <span className="info-name">Remote Candidates</span>
        <span className="info-value">
          <ShowDetailLink
            label={`(${info.remoteCandidates.length})`}
            details={<RtcCandidateDetail candidates={info.remoteCandidates} />}
          />
        </span>
      </div>
    </div>
  );
}

function LocalInfoBlock() {
  const [deviceInfo, setDeviceInfo] = useState({ state: "querying" });
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((info) => {
        setDeviceInfo({ state: "ready", detail: info });
      })
      .catch((err) => {
        setDeviceInfo({ state: "error", detail: err.message });
      });
  }, []);
  return (
    <div className="info-block">
      <div className="info-row">
        <span className="info-name">Devices</span>
        <span className="info-value">
          {deviceInfo.state === "querying" && "Querying..."}
          {deviceInfo.state === "error" && `Error: ${deviceInfo.detail}`}
          {deviceInfo.state === "ready" && (
            <ShowDetailLink
              label="Show"
              details={deviceInfo.detail.map((device) => (
                <pre key={device.id}>{JSON.stringify(device)}</pre>
              ))}
            />
          )}
        </span>
      </div>
    </div>
  );
}

export default function Info() {
  const rtcInfo = useRtcInfoContext();
  return (
    <section className="section-info grow flex flex-col">
      <header>Info</header>
      <div className="overflow-y-scroll basis-0 grow">
        <LocalInfoBlock />
        {Object.entries(rtcInfo).map(([userId, info]) => (
          <RtcInfoBlock key={userId} userId={userId} info={info} />
        ))}
      </div>
    </section>
  );
}
