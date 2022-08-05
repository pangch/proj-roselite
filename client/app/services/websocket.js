import logger from "../utils/logger.js";

let socket = null;

function wsLogger(message, level) {
  logger(`[WebSocket] ${message}`, level);
}

export function initWebSocket() {
  const server = `ws://${window.location.host}`;

  wsLogger(`Connecting to WebSocket server: ${server}`);

  socket = new WebSocket(server);

  socket.onopen = function (e) {
    wsLogger("Connection established");
    socket.send(JSON.stringify({ message: "Hello" }));
  };

  socket.onmessage = function (event) {
    wsLogger(`Data received from server: ${event.data}`, "debug");
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      wsLogger(
        `Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      wsLogger("Connection died");
    }
  };

  socket.onerror = function (error) {
    wsLogger(`Error: ${error.message}`, "error");
  };
}
