import express from "express";
import morgan from "morgan";

import websockets from "./websockets/index.js";

async function boot() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(morgan("combined"));
  app.use(express.static("dist/public"));

  const server = app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });

  await websockets(server);
}

await boot();
