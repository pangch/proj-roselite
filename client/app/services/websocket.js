let socket = null;
let logger = null;

export function initWebSocket(loggerImp) {
  logger = (message, level) => {
    loggerImp(`[WebSocket] ${message}`, level);
  };

  const server = `ws://${window.location.host}`;

  logger(`Connecting to WebSocket server: ${server}`);

  socket = new WebSocket(server);

  socket.onopen = function (e) {
    logger("Connection established");
    socket.send(JSON.stringify({ message: "Hello" }));
  };

  socket.onmessage = function (event) {
    logger(`Data received from server: ${event.data}`, "debug");
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      logger(
        `Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      logger("Connection died");
    }
  };

  socket.onerror = function (error) {
    logger(`Error: ${error.message}`, "error");
  };
}
