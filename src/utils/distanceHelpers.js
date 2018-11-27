export const distanceFrom = (origin, destination) => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((destination.lat - origin.lat) * p) / 2 +
    (c(origin.lat * p) *
      c(destination.lat * p) *
      (1 - c((destination.lng - origin.lng) * p))) /
      2;

  const km = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  return (0.6213 * km).toFixed(2);
};
