import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import Layout from "./Layout";
import ServicesProvider from "./ServicesProvider";

export default function App() {
  return (
    <ConsoleContextProvider>
      <ServicesProvider />
      <Layout />
    </ConsoleContextProvider>
  );
}
