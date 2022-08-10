import { createLogger } from "../../../common/logger.js";
import Observable from "../../../common/observable.js";

const logger = createLogger("DevicesModel");

class DevicesModel extends Observable {
  devices = { state: "none" };

  async queryDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      window.setTimeout(
        () => stream.getTracks().forEach((track) => track.stop()),
        500
      );
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.handleInfo(devices);
    } catch (error) {
      this.devices = {
        detail: error.message,
        state: "error",
      };
      this.emit({ action: "update", devices: this.devices });
    }
  }

  handleInfo(info) {
    const data = {};
    info.forEach((deviceInfo) => {
      const { deviceId, kind, label } = deviceInfo;
      data[kind] = data[kind] || {};
      data[kind][deviceId] = label ?? deviceId;
    });

    this.devices = {
      data,
      state: "ready",
    };
    this.emit({ action: "update", devices: this.devices });
  }
}

const model = new DevicesModel();

export function getDevicesModel() {
  return model;
}
