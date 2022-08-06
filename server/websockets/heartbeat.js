import { getClients } from "./client-controller.js";

let heartbeatInterval = null;

export function addHeartbeat(client) {
  client.isAlive = true;
  client.socket.on("pong", () => (client.isAlive = true));
}

export function startHeartbeat(client) {
  heartbeatInterval = setInterval(() => {
    const clients = getClients();
    for (client of clients) {
      if (client.isAlive === false) {
        return client.socket.terminate();
      }

      client.isAlive = false;
      client.socket.ping();
    }
  }, 10000);
}

export function stopHeartbeat() {
  if (heartbeatInterval != null) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
