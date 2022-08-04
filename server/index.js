import express from "express";
import websockets from "./websockets/index.js";

async function boot() {
  const app = express();
  const port = process.env.PORT || 3001;

  await websockets(app);

  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

await boot();
