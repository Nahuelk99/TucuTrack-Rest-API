import { getConnection } from "../database/connection.js";

export const getTravelTypes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT IdTipoViaje, NombreTipoViaje
      FROM [TucuTrack].[dbo].[TIPO_VIAJE]
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrices = async (req, res) => {
  try {
    const pool = await getConnection();
    const { idEmpresa, origen, destino, idTipoViaje } = req.query;

    // Log de parámetros recibidos
    console.log("Parámetros recibidos:", {
      idEmpresa,
      origen,
      destino,
      idTipoViaje,
    });

    // Validación de parámetros requeridos
    if (!idEmpresa || !origen || !destino || !idTipoViaje) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos",
        required: {
          idEmpresa: !idEmpresa,
          origen: !origen,
          destino: !destino,
          idTipoViaje: !idTipoViaje,
        },
      });
    }

    // Construcción de la query
    const query = `
      SELECT Precio, IdEmpresa, IdCiudadOrigen, IdCiudadDestino, IdTipoViaje
      FROM [TucuTrack].[dbo].[TARIFA]
      WHERE IdEmpresa = @IdEmpresa
      AND IdCiudadOrigen = @IdCiudadOrigen
      AND IdCiudadDestino = @IdCiudadDestino
      AND IdTipoViaje = @IdTipoViaje
    `;

    // Configuración de parámetros
    const request = pool
      .request()
      .input("IdEmpresa", idEmpresa)
      .input("IdCiudadOrigen", origen)
      .input("IdCiudadDestino", destino)
      .input("IdTipoViaje", idTipoViaje);

    // Log de la query
    console.log("Query a ejecutar:", query);

    const result = await request.query(query);
    console.log("Resultado de la query:", result.recordset);

    if (result.recordset.length > 0) {
      const tarifa = result.recordset[0];
      console.log("Tarifa encontrada:", tarifa);
      res.json({
        precio: tarifa.Precio,
        detalles: {
          idEmpresa: tarifa.IdEmpresa,
          idCiudadOrigen: tarifa.IdCiudadOrigen,
          idCiudadDestino: tarifa.IdCiudadDestino,
          idTipoViaje: tarifa.IdTipoViaje,
        },
      });
    } else {
      console.log("No se encontró tarifa para los parámetros proporcionados");
      res.status(404).json({
        message: "Tarifa no encontrada",
        parametros: {
          idEmpresa,
          origen,
          destino,
          idTipoViaje,
        },
      });
    }
  } catch (error) {
    console.error("Error en getPrecios:", error);
    res.status(500).json({
      message: "Error al obtener la tarifa",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
