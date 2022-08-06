import * as React from "react";
import * as ReactDOM from "react-dom/client";

import "./app/services/websockets";

import "./styles/utilities.css";
import "./styles/main.css";
import App from "./app/App";

function boot() {
  const app = ReactDOM.createRoot(document.getElementById("app"));
  app.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

boot();
