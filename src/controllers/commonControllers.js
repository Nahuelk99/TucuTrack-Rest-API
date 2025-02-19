import { getConnection } from "../database/connection.js";

export const getCompanies = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT IdEmpresa, CUIT, NombreEmpresa
      FROM [TucuTrack].[dbo].[EMPRESA]
      ORDER BY NombreEmpresa
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT IdCiudad, NombreCiudad
      FROM [TucuTrack].[dbo].[CIUDAD]
      ORDER BY NombreCiudad
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
