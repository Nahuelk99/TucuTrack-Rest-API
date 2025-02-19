import { Server } from "socket.io";
import { getConnection } from "../database/connection.js";
import { findNearestStops } from "../data/busStops.js";

let io;

export const initializeSocketIO = (server) => {
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const calculateBusPosition = (startTime, endTime, startStop, endStop) => {
  const now = new Date();
  const start = new Date(now.toDateString() + " " + startTime);
  const end = new Date(now.toDateString() + " " + endTime);

  if (now < start) return { lat: startStop.lat, lon: startStop.lon };
  if (now > end) return { lat: endStop.lat, lon: endStop.lon };

  const totalDuration = end - start;
  const elapsedTime = now - start;
  const progress = elapsedTime / totalDuration;

  const lat = startStop.lat + (endStop.lat - startStop.lat) * progress;
  const lon = startStop.lon + (endStop.lon - startStop.lon) * progress;

  return { lat, lon };
};

export const startBusSimulation = async () => {
  const updateInterval = 20000; // 20 seconds

  setInterval(async () => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT IdHorario, CiudadOrigen, CiudadDestino, HoraSalida, HoraLlegada
        FROM HORARIO
        WHERE CONVERT(time, GETDATE()) BETWEEN HoraSalida AND HoraLlegada
      `);

      console.log("SQL query result:", result.recordset);

      const busPositions = result.recordset
        .map((bus) => {
          console.log("Processing bus:", bus);

          const [startStop] = findNearestStops(bus.CiudadOrigen);
          const [endStop] = findNearestStops(bus.CiudadDestino);

          console.log("Start stop:", startStop, "End stop:", endStop);

          if (!startStop || !endStop) {
            console.error("Could not find stops for bus:", bus);
            return null;
          }

          return {
            idHorario: bus.IdHorario,
            position: calculateBusPosition(
              bus.HoraSalida,
              bus.HoraLlegada,
              startStop,
              endStop
            ),
          };
        })
        .filter(Boolean); // Elimina los elementos null

      console.log("Emitting bus positions:", busPositions);
      io.emit("busPositionsUpdate", busPositions);
    } catch (error) {
      console.error("Error updating bus positions:", error);
    }
  }, updateInterval);
};
