import { getConnection } from "../database/connection.js";

export const getSchedules = async (req, res) => {
  try {
    const pool = await getConnection();
    const {
      idEmpresa,
      idCiudadOrigen,
      idCiudadDestino,
      idTipoServicio,
      idTipoHorario,
    } = req.query;

    // Validación de parámetros requeridos
    if (!idEmpresa || !idCiudadOrigen || !idCiudadDestino) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos",
        required: {
          idEmpresa: !idEmpresa,
          idCiudadOrigen: !idCiudadOrigen,
          idCiudadDestino: !idCiudadDestino,
        },
      });
    }

    // Query modificada para manejar el formato de tiempo correctamente
    let query = `
      SELECT 
        h.IdHorario,
        h.IdEmpresa,
        h.CiudadOrigen,
        h.CiudadDestino,
        h.IdTipoServicio,
        h.IdTipoHorario,
        CASE 
          WHEN h.HoraSalida IS NOT NULL 
          THEN SUBSTRING(CONVERT(varchar, h.HoraSalida, 108), 1, 5)
          ELSE NULL 
        END as HoraSalida,
        CASE 
          WHEN h.HoraLlegada IS NOT NULL 
          THEN SUBSTRING(CONVERT(varchar, h.HoraLlegada, 108), 1, 5)
          ELSE NULL 
        END as HoraLlegada,
        FORMAT(h.FechaVigencia, 'yyyy-MM-dd') as FechaVigencia,
        e.NombreEmpresa,
        co.NombreCiudad AS CiudadOrigenNombre,
        cd.NombreCiudad AS CiudadDestinoNombre,
        ts.NombreTipoServicio,
        th.NombreTipoHorario
      FROM [TucuTrack].[dbo].[HORARIO] h
      LEFT JOIN [TucuTrack].[dbo].[EMPRESA] e ON h.IdEmpresa = e.IdEmpresa
      LEFT JOIN [TucuTrack].[dbo].[CIUDAD] co ON h.CiudadOrigen = co.IdCiudad
      LEFT JOIN [TucuTrack].[dbo].[CIUDAD] cd ON h.CiudadDestino = cd.IdCiudad
      LEFT JOIN [TucuTrack].[dbo].[TIPO_SERVICIO] ts ON h.IdTipoServicio = ts.IdTipoServicio
      LEFT JOIN [TucuTrack].[dbo].[TIPO_HORARIO] th ON h.IdTipoHorario = th.IdTipoHorario
      WHERE h.CiudadOrigen = @IdCiudadOrigen
      AND h.CiudadDestino = @IdCiudadDestino
    `;

    // Configuración del request
    const request = pool
      .request()
      .input("IdCiudadOrigen", idCiudadOrigen)
      .input("IdCiudadDestino", idCiudadDestino);

    // Agregar filtros opcionales
    if (idEmpresa) {
      query += " AND h.IdEmpresa = @IdEmpresa";
      request.input("IdEmpresa", idEmpresa);
    }

    if (idTipoServicio) {
      query += " AND h.IdTipoServicio = @IdTipoServicio";
      request.input("IdTipoServicio", idTipoServicio);
    }

    if (idTipoHorario) {
      query += " AND h.IdTipoHorario = @IdTipoHorario";
      request.input("IdTipoHorario", idTipoHorario);
    }

    // Ordenar por hora de salida, manejando NULLs
    query += " ORDER BY h.HoraSalida";

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "No se encontraron horarios para la ruta especificada",
        parametros: {
          idEmpresa,
          idCiudadOrigen,
          idCiudadDestino,
          idTipoServicio,
          idTipoHorario,
        },
      });
    }

    // Para debug - imprimir el primer registro
    console.log("Primer registro:", result.recordset[0]);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({
      message: "Error al obtener horarios",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getServiceTypesByCompanies = async (req, res) => {
  try {
    const pool = await getConnection();
    const { idEmpresa } = req.params;

    const result = await pool.request().input("IdEmpresa", idEmpresa).query(`
        SELECT es.IdEmpServ, es.IdEmpresa, ts.IdTipoServicio, ts.NombreTipoServicio
        FROM [TucuTrack].[dbo].[EMPRESA_SERVICIO] es
        INNER JOIN [TucuTrack].[dbo].[TIPO_SERVICIO] ts 
          ON es.IdTipoServicio = ts.IdTipoServicio
        WHERE es.IdEmpresa = @IdEmpresa
        ORDER BY ts.IdTipoServicio
      `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduleTypesByCompanies = async (req, res) => {
  try {
    const pool = await getConnection();
    const { idEmpresa } = req.params;

    const result = await pool.request().input("IdEmpresa", idEmpresa).query(`
        SELECT eh.IdEmpHorario, eh.IdEmpresa, th.IdTipoHorario, th.NombreTipoHorario
        FROM [TucuTrack].[dbo].[EMPRESA_HORARIO] eh
        INNER JOIN [TucuTrack].[dbo].[TIPO_HORARIO] th 
        ON eh.IdTipoHorario = th.IdTipoHorario
        WHERE eh.IdEmpresa = @IdEmpresa
        ORDER BY th.IdTipoHorario
      `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
