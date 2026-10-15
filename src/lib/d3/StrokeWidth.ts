export const LINE_WIDTH_MULTIPLIER = 1;
export const MIN_LINE_WIDTH = 0.02;
export const MIN_POINT_RADIUS = 0.05;

export function strokeWidthFor(base: number, totalZoom: number, baseZoom = 1) {
  const relative = Math.max(totalZoom, 1e-6) / Math.max(baseZoom, 1e-6);
  return Math.max(MIN_LINE_WIDTH, (base * LINE_WIDTH_MULTIPLIER) / relative);
}

export function pointRadiusFor(base: number, totalZoom: number, baseZoom = 1) {
  const relative = Math.max(totalZoom, 1e-6) / Math.max(baseZoom, 1e-6);
  return Math.max(MIN_POINT_RADIUS, (base * LINE_WIDTH_MULTIPLIER) / relative);
}
