import { getContext, setContext } from 'svelte';
import { HALF_GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';

export type ScreenWindow = { xMin: number; xMax: number; yMin: number; yMax: number };
export type CameraSnapshot = { zoom: number; window: ScreenWindow };
export type CameraView2D = {
  readonly live: CameraSnapshot;
  readonly settled: CameraSnapshot;
  readonly baseZoom: number;
};

const KEY = 'camera-view-2d';
const FALLBACK_SNAPSHOT: CameraSnapshot = {
  zoom: 1,
  window: { xMin: -7.5, xMax: 7.5, yMin: -7.5, yMax: 7.5 }
};
const FALLBACK: CameraView2D = {
  live: FALLBACK_SNAPSHOT,
  settled: FALLBACK_SNAPSHOT,
  baseZoom: 1
};

export const setCameraView2D = (v: CameraView2D) => setContext(KEY, v);
export const getCameraView2D = () => getContext<CameraView2D>(KEY) ?? FALLBACK;

export function visibleScreenWindow(a: {
  tx: number;
  ty: number;
  k: number;
  cx: number;
  cy: number;
  z: number;
  width: number;
  height: number;
}): ScreenWindow {
  const S = a.width / HALF_GRID_SIZE_2D;
  const inv = (p: number, t: number, half: number) => ((p - t) / a.k - half) / (a.z * S);
  return {
    xMin: a.cx + inv(0, a.tx, a.width / 2),
    xMax: a.cx + inv(a.width, a.tx, a.width / 2),
    yMax: a.cy - inv(0, a.ty, a.height / 2),
    yMin: a.cy - inv(a.height, a.ty, a.height / 2)
  };
}
