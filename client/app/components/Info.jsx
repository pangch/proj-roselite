import * as React from "react";
import { useState, useEffect } from "react";
import { useRtcInfoContext } from "../contexts/RtcInfoContext";
import { useUserNameFromId } from "../contexts/SessionContext";
import { getDevicesModel } from "../models/devices-model";
import ShowDetailLink from "./ShowDetailLink";

function RtcDescriptionDetail({ description }) {
  return (
    <div>
      <strong>Type: {description.type}</strong>
      <hr />
      <pre>{description.sdp}</pre>
    </div>
  );
}

function RtcCandidateDetail({ candidates }) {
  return candidates.map(
    (c, index) =>
      c && (
        <div key={index}>
          <div>SDP Mid: {c.sdpMid}</div>
          <div>SDP MLineIndex: {c.sdpMLineIndex}</div>
          <div>Username Fragment: {c.usernameFragment}</div>
          <div>Candidate: {c.candidate}</div>
          <hr />
        </div>
      )
  );
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
  const devicesModel = getDevicesModel();
  const [deviceInfo, setDeviceInfo] = useState(devicesModel.devices);

  useEffect(() => {
    const unsubscribe = getDevicesModel().subscribe((action) =>
      setDeviceInfo(action.devices)
    );
    return () => unsubscribe();
  }, [devicesModel]);
  return (
    <div className="info-block">
      <div className="info-row">
        <span className="info-name">Devices</span>
        <span className="info-value">
          {deviceInfo.state === "none" && (
            <div
              className="details-link"
              onClick={() => devicesModel.queryDevices()}
            >
              Load
            </div>
          )}
          {deviceInfo.state === "error" && (
            <ShowDetailLink label="Error" details={deviceInfo.detail} />
          )}
        </span>
      </div>
      {deviceInfo.state === "ready" && (
        <div className="info-row flex flex-col">
          <strong>Audio Input</strong>
          {deviceInfo.data?.audioinput &&
            Object.entries(deviceInfo.data.audioinput).map(([id, label]) => (
              <div key={id}>{label}</div>
            ))}
          <strong>Video Input</strong>
          {deviceInfo.data?.videoinput &&
            Object.entries(deviceInfo.data?.videoinput).map(([id, label]) => (
              <div key={id}>{label}</div>
            ))}
        </div>
      )}
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
