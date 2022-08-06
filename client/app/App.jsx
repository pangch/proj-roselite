import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { MessagesContextProvider } from "./contexts/MessagesContext";
import { SessionContextProvider } from "./contexts/SessionContext";
import { UsersContextProvider } from "./contexts/UsersContext";
import { VideosContextProvider } from "./contexts/VideosContext";
import Layout from "./Layout";

export default function App() {
  return (
    <UsersContextProvider>
      <ConsoleContextProvider>
        <MessagesContextProvider>
          <SessionContextProvider>
            <VideosContextProvider>
              <Layout />
            </VideosContextProvider>
          </SessionContextProvider>
        </MessagesContextProvider>
      </ConsoleContextProvider>
    </UsersContextProvider>
  );
}
