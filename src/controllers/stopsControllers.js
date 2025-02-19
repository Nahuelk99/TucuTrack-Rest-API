import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getStops = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM PARADA");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStop = async (req, res) => {
  const { IdParada } = req.params;

  if (isNaN(IdParada)) {
    return res
      .status(400)
      .json({ message: "IdParada debe ser un número entero" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("IdParada", sql.Int, IdParada)
      .query("SELECT * FROM PARADA WHERE IdParada = @IdParada");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Parada no encontrada" });
    }
    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
