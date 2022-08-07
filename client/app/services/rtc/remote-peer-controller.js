import { createLogger } from "../../../../common/logger.js";
import { getRemoteMediaModel } from "../../models/remote-media-model.js";
import { getWSRtcService } from "../websockets/index.js";

let logger = createLogger("RemotePeerController");

export default class RemotePeerController {
  peerConnection = null;

  constructor(userId) {
    this.userId = userId;
  }

  shutdown() {}
}
