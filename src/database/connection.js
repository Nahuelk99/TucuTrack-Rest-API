import sql from "mssql";

const dbSettings = {
  user: "TucuTrackUser",
  password: "MiContraseñaSegura2025",
  server: "localhost",
  database: "TucuTrack",
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);

    const result = await pool.request().query("Select top (10) * from TARIFA");
    console.log(result);
    return pool;
  } catch (error) {
    console.error("El error es: ", error);
  }
};
