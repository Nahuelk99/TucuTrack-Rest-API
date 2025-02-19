export const BUS_STOPS = [
  { name: "Tucumán", lat: -26.808285, lon: -65.21759 },
  { name: "Famaillá", lat: -27.054722, lon: -65.404722 },
  { name: "Monteros", lat: -27.166667, lon: -65.5 },
  { name: "Concepción", lat: -27.333333, lon: -65.583333 },
  { name: "Aguilares", lat: -27.425259, lon: -65.609674 },
  { name: "Santa Ana", lat: -27.473591, lon: -65.685338 },
  { name: "Alberdi", lat: -27.588324, lon: -65.6198 },
  { name: "La Cocha", lat: -27.773335, lon: -65.589027 },
];

export const findNearestStops = (cityName) => {
  // Verificar si cityName es válido
  if (typeof cityName !== "string" || cityName.trim() === "") {
    console.error("Invalid cityName:", cityName);
    return [BUS_STOPS[0]]; // Retorna la primera parada como fallback
  }

  const cityNameLower = cityName.toLowerCase();
  // Encuentra la parada exacta si existe
  const exactStop = BUS_STOPS.find(
    (stop) => stop.name.toLowerCase() === cityNameLower
  );
  if (exactStop) return [exactStop];

  // Si no hay una parada exacta, encuentra las dos paradas más cercanas alfabéticamente
  const sortedStops = [...BUS_STOPS].sort(
    (a, b) =>
      a.name.toLowerCase().localeCompare(cityNameLower) -
      b.name.toLowerCase().localeCompare(cityNameLower)
  );

  return [sortedStops[0], sortedStops[1]];
};
