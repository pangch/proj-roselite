import { getClients } from "./client-handler.js";

let heartbeatInterval = null;

export function addHeartbeat(client) {
  client.isAlive = true;
  client.websocket.on("pong", () => (client.isAlive = true));
}

export function startHeartbeat(client) {
  heartbeatInterval = setInterval(() => {
    const clients = getClients();
    for (client of clients) {
      if (client.isAlive === false) {
        return client.websocket.terminate();
      }

      client.isAlive = false;
      client.websocket.ping();
    }
  }, 10000);
}

export function stopHeartbeat() {
  if (heartbeatInterval != null) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
