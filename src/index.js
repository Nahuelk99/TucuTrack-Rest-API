import { server } from "./app.js";
import { getConnection } from "./database/connection.js";

getConnection();

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
