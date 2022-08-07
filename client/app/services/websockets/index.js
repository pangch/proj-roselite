import { createLogger } from "../../../../common/logger.js";
import WSClient from "./ws-client.js";

const logger = createLogger("WebSocket");

const MIN_RECONNECT_WAIT = 100;
const MAX_RECONNECT_WAIT = 5 * 60 * 1000;

let wsClient = null;
let reconnectWait = MIN_RECONNECT_WAIT;

function connectWithRetry() {
  if (wsClient !== null) {
    reconnectWait = MIN_RECONNECT_WAIT;
    return;
  }
  setTimeout(() => {
    wsClient = new WSClient();
    wsClient.socket.addEventListener("open", () => {
      reconnectWait = MIN_RECONNECT_WAIT;
    });
    wsClient.socket.addEventListener("close", () => {
      wsClient = null;
      connectWithRetry();
    });

    // Exponential backoff
    reconnectWait *= 2;
    if (reconnectWait > MAX_RECONNECT_WAIT) {
      reconnectWait = MAX_RECONNECT_WAIT;
    }
  }, reconnectWait);
}

// Connect upon startup.
connectWithRetry();

export function getWSService() {
  if (wsClient == null) {
    logger.error("Cannot send WS message because no active connection.");
    return;
  }
  return wsClient.service;
}

export function getWSRtcService() {
  if (wsClient == null) {
    logger.error("Cannot send RTC signal because no active connection.");
    return;
  }
  return wsClient.rtcService;
}
