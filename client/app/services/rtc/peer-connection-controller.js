import { createLogger } from "../../../../common/logger.js";

let logger = createLogger("PeerConnectionController");

let constraints = {
  audio: true,
  video: true,
};

export default class PeerConnectionController {}
