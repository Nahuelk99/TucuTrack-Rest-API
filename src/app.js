import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import pricesRoutes from "./routes/pricesRoutes.js";
import schedulesRoutes from "./routes/schedulesRoutes.js";
import stopsRoutes from "./routes/stopsRoutes.js";
import {
  initializeSocketIO,
  startBusSimulation,
} from "./services/busSimulation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:8081", "http://192.168.1.105:8081"], // Permitir solicitudes desde Expo
  })
);

app.use(express.json());

app.use(pricesRoutes);
app.use(schedulesRoutes);
app.use(stopsRoutes);

app.get("/test-client", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "test-client.html"));
});

initializeSocketIO(server);
startBusSimulation();

export { app, server };
