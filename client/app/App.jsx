import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { LocalMediaContextProvider } from "./contexts/LocalMediaContext";
import { MessagesContextProvider } from "./contexts/MessagesContext";
import { RemoteMediaContextProvider } from "./contexts/RemoteMediaContext";
import { SessionContextProvider } from "./contexts/SessionContext";
import Layout from "./Layout";

export default function App() {
  return (
    <ConsoleContextProvider>
      <SessionContextProvider>
        <MessagesContextProvider>
          <LocalMediaContextProvider>
            <RemoteMediaContextProvider>
              <Layout />
            </RemoteMediaContextProvider>
          </LocalMediaContextProvider>
        </MessagesContextProvider>
      </SessionContextProvider>
    </ConsoleContextProvider>
  );
}
