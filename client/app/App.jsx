import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { MessagesContextProvider } from "./contexts/MessagesContext";
import { SessionContextProvider } from "./contexts/SessionContext";
import { VideosContextProvider } from "./contexts/VideosContext";
import Layout from "./Layout";

export default function App() {
  return (
    <ConsoleContextProvider>
      <SessionContextProvider>
        <MessagesContextProvider>
          <VideosContextProvider>
            <Layout />
          </VideosContextProvider>
        </MessagesContextProvider>
      </SessionContextProvider>
    </ConsoleContextProvider>
  );
}
