# TucuTrack Backend

## Descripción
Este es el backend de la aplicación **TucuTrack**, desarrollado con **Express.js** sobre **Node.js**. Proporciona una API REST para gestionar la información sobre localización (simulada por el momento), horarios, tarifas y paradas de colectivos de dos empresas del sur de Tucumán. Utiliza **SQL Server** como base de datos para almacenar y consultar la información.

## Tecnologías utilizadas
* **Node.js**
* **Express.js**
* **SQL Server**
* **Sequelize**
* **Socket.IO** (para simulación de localización en tiempo real)

## Instalación y Configuración

### Prerrequisitos
1. Tener **Node.js** instalado
2. Tener **SQL Server** configurado y en ejecución
3. Configurar las credenciales de la base de datos en `config.js` o en variables de entorno

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/Nahuelk99/TucuTrack-Rest-API.git
cd TucuTrack-Rest-API
```

2. Instalar las dependencias:
```bash
npm install
```

### Configuración de la Base de Datos
Modificar el archivo `config.js` o configurar las variables de entorno:

```javascript
module.exports = {
  db: {
    user: 'tu_usuario',
    password: 'tu_contraseña',
    server: 'tu_servidor',
    database: 'TucuTrack',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
};
```

### Ejecución del Servidor
Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

O en modo producción:
```bash
npm start
```

## API Endpoints

### Ciudades
- `GET /cities` - Obtiene todas las ciudades disponibles

### Tipos de Viaje
- `GET /travel-types` - Obtiene los tipos de viaje disponibles

### Empresas
- `GET /companies` - Obtiene la lista de empresas de transporte

### Paradas
- `GET /stops/:id` - Obtiene información de una parada específica
  - Ejemplo: `/stops/2`

### Tipos de Servicio
- `GET /service-types/:id` - Obtiene información sobre un tipo de servicio específico
  - Ejemplo: `/service-types/1`

### Tipos de Horarios
- `GET /schedules-types/:id` - Obtiene información sobre un tipo de horario específico
  - Ejemplo: `/schedules-types/3`

### Precios
- `GET /prices` - Obtiene precios según filtros específicos
  - Parámetros requeridos:
    - `idEmpresa`: ID de la empresa
    - `origen`: ID de la ciudad de origen
    - `destino`: ID de la ciudad de destino
    - `idTipoViaje`: ID del tipo de viaje
  - Ejemplo: `/prices?idEmpresa=1&origen=8&destino=2&idTipoViaje=1`

### Horarios
- `GET /schedules` - Obtiene horarios según filtros específicos
  - Parámetros requeridos:
    - `idEmpresa`: ID de la empresa
    - `idCiudadOrigen`: ID de la ciudad de origen
    - `idCiudadDestino`: ID de la ciudad de destino
  - Ejemplo: `/schedules?idEmpresa=1&idCiudadOrigen=1&idCiudadDestino=10`

## Contribución
Si deseas contribuir a este proyecto:
1. Realiza un fork del repositorio
2. Crea una nueva rama (`feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz un commit (`git commit -m 'Agrega nueva funcionalidad'`)
4. Realiza un push a tu rama y abre un Pull Request

## Licencia
Este proyecto está bajo la licencia MIT. Puedes consultarla en el archivo `LICENSE`.

