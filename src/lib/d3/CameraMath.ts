import { Vector2 } from 'three';

/** Relative bound on the d3-zoom overlay's `k`, applied on top of the base camera zoom. */
export const MAX_ZOOM_FACTOR = 6;

/** Scene units visible across the canvas width at zoom 1. Matches `ViewBox.ts`. */
export const VISIBLE_SCENE_WIDTH = 15;

/** The user-pan/zoom scale bounds allowed relative to a given base zoom. */
export function zoomScaleExtent(baseZoom: number): [number, number] {
  return [baseZoom / MAX_ZOOM_FACTOR, MAX_ZOOM_FACTOR / baseZoom];
}

/** Clamps an absolute zoom target to what's reachable from `initialZoom` at rest. */
export function clampCameraZoom(target: number, initialZoom: number): number {
  const [minZoom, maxZoom] = zoomScaleExtent(initialZoom).map((k) => k * initialZoom);
  return Math.min(Math.max(target, minZoom), maxZoom);
}

export type ZoomView = [number, number, number];

/** Encodes a base camera (position, zoom) as a d3 `interpolateZoom` view. */
export function toZoomView(position: Vector2, zoom: number): ZoomView {
  return [position.x, position.y, VISIBLE_SCENE_WIDTH / zoom];
}

/** Decodes a d3 `interpolateZoom` view back into a base camera (position, zoom). */
export function fromZoomView(view: ZoomView): { position: Vector2; zoom: number } {
  const [x, y, w] = view;
  return { position: new Vector2(x, y), zoom: VISIBLE_SCENE_WIDTH / w };
}
