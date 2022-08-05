import * as React from "react";

import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import Layout from "./Layout";
import ServicesInitializer from "./ServicesInitializer";

export default function App() {
  return (
    <ConsoleContextProvider>
      <ServicesInitializer />
      <Layout />
    </ConsoleContextProvider>
  );
}
