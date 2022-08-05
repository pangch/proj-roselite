import * as React from "react";
import { useEffect } from "react";
import { initWebSocket } from "./services/websocket";

let initialized = false;

function initServices() {
  if (initialized) {
    return;
  }
  initialized = true;

  initWebSocket();
}

export default function ServicesInitializer() {
  useEffect(() => {
    initServices();
  }, []);
  return null;
}
