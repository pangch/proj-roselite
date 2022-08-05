import * as React from "react";
import { useEffect } from "react";
import { useLogger } from "./contexts/ConsoleContext";
import { initWebSocket } from "./services/websocket";

let initialized = false;

function initServices(logger) {
  if (initialized) {
    return;
  }
  initialized = true;

  initWebSocket(logger);
}

export default function ServicesProvider() {
  const logger = useLogger();

  useEffect(() => {
    initServices(logger);
  }, []);
  return null;
}
