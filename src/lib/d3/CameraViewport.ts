import { HALF_GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';

/**
 * d3's zoom behaviour reports transform.x/y as raw SVG pixel deltas, but CanvasD3's
 * inner <g> scales that same space to ±HALF_GRID_SIZE_2D via `scale(2*width/GRID_SIZE_2D, ...)`.
 * Single owner of that pixel↔screen-unit conversion, so CanvasD3's transformScene and
 * AxisLabels' layout math read it from one place instead of re-deriving it independently (#492).
 */
export function pixelDeltaToScreenUnit(pixelDelta: number, width: number): number {
  return (pixelDelta * HALF_GRID_SIZE_2D) / width;
}

/** Inverse of {@link pixelDeltaToScreenUnit}. */
export function screenUnitToPixelDelta(screenUnit: number, width: number): number {
  return (screenUnit * width) / HALF_GRID_SIZE_2D;
}
