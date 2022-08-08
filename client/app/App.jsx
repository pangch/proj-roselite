import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { LocalMediaContextProvider } from "./contexts/LocalMediaContext";
import { MessagesContextProvider } from "./contexts/MessagesContext";
import { RemoteMediaContextProvider } from "./contexts/RemoteMediaContext";
import { RtcInfoContextProvider } from "./contexts/RtcInfoContext";
import { SessionContextProvider } from "./contexts/SessionContext";
import Layout from "./Layout";

export default function App() {
  return (
    <ConsoleContextProvider>
      <RtcInfoContextProvider>
        <SessionContextProvider>
          <MessagesContextProvider>
            <LocalMediaContextProvider>
              <RemoteMediaContextProvider>
                <Layout />
              </RemoteMediaContextProvider>
            </LocalMediaContextProvider>
          </MessagesContextProvider>
        </SessionContextProvider>
      </RtcInfoContextProvider>
    </ConsoleContextProvider>
  );
}
