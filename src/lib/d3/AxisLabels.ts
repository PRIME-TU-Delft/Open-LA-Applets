import type { Transform2D } from '$lib/stores/camera.svelte';
import { GRID_SIZE_2D, HALF_GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
import { clamp } from '$lib/utils/MathLib';
import type { Vector2 } from 'three';
import { IDENTITY_PROJECTION, type Projection2D } from './Projection2D';

export type LabelProps = {
  xLabel?: string;
  yLabel?: string;
  xLabelPosition?: 'center' | 'end';
  xLabelOffset?: Vector2;
  yLabelPosition?: 'center' | 'top';
  yLabelRotate?: boolean;
  yLabelOffset?: Vector2;
  size?: number;
  xColor?: string;
  yColor?: string;
};

export type CameraBaseline = { x: number; y: number };

export type AxisLabelLayout = {
  cameraTransform: Transform2D | undefined;
  cameraBaseline: CameraBaseline | undefined;
  width: number;
  height: number;
  cameraZoom: number;
  labels: LabelProps | undefined;
  projection?: Projection2D;
};

type NormalizedAxisLabelLayout = {
  baseline: CameraBaseline;
  normalizedPan: Transform2D;
  zoom: number;
  totalZoom: number;
};

/**
 * CanvasD3 computes x and y as pan contribution plus initial camera baseline.
 * Remove that baseline for viewport-relative label placement.
 */
function normalizeCamera(
  cameraTransform: Transform2D,
  cameraBaseline: CameraBaseline | undefined
): Transform2D {
  return {
    ...cameraTransform,
    x: cameraTransform.x - (cameraBaseline?.x ?? 0),
    y: cameraTransform.y - (cameraBaseline?.y ?? 0)
  } as Transform2D;
}

function normalizeAxisLabelLayout(
  cameraTransform: Transform2D | undefined,
  cameraBaseline: CameraBaseline | undefined,
  cameraZoom: number
): NormalizedAxisLabelLayout | undefined {
  if (!cameraTransform) return undefined;

  const zoom = Math.max(cameraTransform.k, 1e-6);

  return {
    baseline: { x: cameraBaseline?.x ?? 0, y: cameraBaseline?.y ?? 0 },
    normalizedPan: normalizeCamera(cameraTransform, cameraBaseline),
    zoom,
    totalZoom: zoom * cameraZoom
  };
}

function clampToGrid(screenValue: number): number {
  return clamp(screenValue, -GRID_SIZE_2D, GRID_SIZE_2D);
}

export function getXLabelX({
  cameraTransform,
  cameraBaseline,
  width,
  cameraZoom,
  labels,
  projection = IDENTITY_PROJECTION
}: AxisLabelLayout): number {
  const normalized = normalizeAxisLabelLayout(cameraTransform, cameraBaseline, cameraZoom);
  if (!normalized) return projection.xToWorld(6.8);

  const { baseline, normalizedPan, totalZoom } = normalized;

  const screenXAtCenter = baseline.x - 7.5 / cameraZoom + (7.5 + normalizedPan.x) / totalZoom;

  if (labels?.xLabelPosition === 'center') {
    return projection.xToWorld(clampToGrid(screenXAtCenter));
  }

  const edgeMarginPx = 48;
  const rightEdgeFactor = HALF_GRID_SIZE_2D * (1 - edgeMarginPx / width);

  const screenXAtRight =
    baseline.x - 7.5 / cameraZoom + (rightEdgeFactor + normalizedPan.x) / totalZoom;

  return projection.xToWorld(clampToGrid(screenXAtRight));
}

export function getYLabelY({
  cameraTransform,
  cameraBaseline,
  width,
  height,
  cameraZoom,
  labels,
  projection = IDENTITY_PROJECTION
}: AxisLabelLayout): number {
  const normalized = normalizeAxisLabelLayout(cameraTransform, cameraBaseline, cameraZoom);
  if (!normalized) return projection.yToWorld(6.25);

  const { baseline, normalizedPan, zoom } = normalized;

  const translateY = (normalizedPan.y * width) / HALF_GRID_SIZE_2D;
  const scaleFactor = HALF_GRID_SIZE_2D / (width * cameraZoom);

  const screenYAtCenter =
    baseline.y + scaleFactor * (height / 2 + translateY / zoom - height / (2 * zoom));

  if (labels?.yLabelPosition === 'center') {
    return projection.yToWorld(clampToGrid(screenYAtCenter));
  }

  const edgeMarginPx = 30;
  const screenYAtTopMargin =
    baseline.y + scaleFactor * (height / 2 + translateY / zoom - edgeMarginPx / zoom);

  return projection.yToWorld(clampToGrid(screenYAtTopMargin));
}
