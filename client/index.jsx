import * as React from "react";
import * as ReactDOM from "react-dom";

import "./styles/main.css";
import App from "./app";

function boot() {
  const app = ReactDOM.createRoot(document.getElementById("app"));
  app.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

boot();
