import * as React from "react";
import { useState, useEffect } from "react";
import ShowDetailLink from "./ShowDetailLink";

function DeviceInfoDetails({ info }) {}

function LocalInfoBlock() {
  const [deviceInfo, setDeviceInfo] = useState({ state: "querying" });
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((info) => {
        console.log(info);
        setDeviceInfo({ state: "ready", detail: info });
      })
      .catch((err) => {
        setDeviceInfo({ state: "error", detail: err.message });
      });
  }, []);
  return (
    <div className="info-block">
      <div className="info-row">
        <span className="info-header">Devices</span>
        <span className="info-value">
          {deviceInfo.state === "querying" && "Querying..."}
          {deviceInfo.state === "error" && `Error: ${deviceInfo.detail}`}
          {deviceInfo.state === "ready" && (
            <ShowDetailLink
              label="Show"
              details={deviceInfo.detail.map((device) => (
                <pre>{JSON.stringify(device)}</pre>
              ))}
            />
          )}
        </span>
      </div>
    </div>
  );
}

export default function Info() {
  return (
    <section className="section-info grow flex flex-col">
      <header>Info</header>
      <div className="overflow-y-scroll basis-0 grow">
        <LocalInfoBlock />
      </div>
    </section>
  );
}
