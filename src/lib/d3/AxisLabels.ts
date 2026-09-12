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

/**
 * CanvasD3 computes x and y as pan contribution plus initial camera baseline.
 * Remove that baseline for viewport-relative label placement.
 */
function normalizeCamera(
  cameraTransform: Transform2D | undefined,
  cameraBaseline: CameraBaseline | undefined
): Transform2D | undefined {
  if (!cameraTransform) return undefined;

  return {
    ...cameraTransform,
    x: cameraTransform.x - (cameraBaseline?.x ?? 0),
    y: cameraTransform.y - (cameraBaseline?.y ?? 0)
  } as Transform2D;
}

export function getXLabelX(
  cameraTransform: Transform2D | undefined,
  cameraBaseline: CameraBaseline | undefined,
  width: number,
  cameraZoom: number,
  labels: LabelProps | undefined,
  projection: Projection2D = IDENTITY_PROJECTION
): number {
  const normalizedCamera = normalizeCamera(cameraTransform, cameraBaseline);
  if (!cameraTransform || !normalizedCamera) return projection.xToWorld(6.8);

  const baselineX = cameraBaseline?.x ?? 0;
  const normalizedPanX = normalizedCamera.x;
  const zoom = Math.max(cameraTransform.k, 1e-6);
  const totalZoom = zoom * cameraZoom;

  const screenXAtCenter = baselineX - 7.5 / cameraZoom + (7.5 + normalizedPanX) / totalZoom;

  if (labels && labels.xLabelPosition == 'center') {
    return projection.xToWorld(clamp(screenXAtCenter, -GRID_SIZE_2D, GRID_SIZE_2D));
  }

  const edgeMarginPx = 48;

  const rightEdgeFactor = HALF_GRID_SIZE_2D * (1 - edgeMarginPx / width);

  const screenXAtRight =
    baselineX - 7.5 / cameraZoom + (rightEdgeFactor + normalizedPanX) / totalZoom;

  return projection.xToWorld(clamp(screenXAtRight, -GRID_SIZE_2D, GRID_SIZE_2D));
}

export function getYLabelY(
  cameraTransform: Transform2D | undefined,
  cameraBaseline: CameraBaseline | undefined,
  width: number,
  height: number,
  cameraZoom: number,
  labels: LabelProps | undefined,
  projection: Projection2D = IDENTITY_PROJECTION
): number {
  const normalizedCamera = normalizeCamera(cameraTransform, cameraBaseline);
  if (!cameraTransform || !normalizedCamera) return projection.yToWorld(6.25);

  const baselineY = cameraBaseline?.y ?? 0;
  const normalizedPanY = normalizedCamera.y;
  const zoom = Math.max(cameraTransform.k, 1e-6);

  const translateY = (normalizedPanY * width) / HALF_GRID_SIZE_2D;
  const scaleFactor = HALF_GRID_SIZE_2D / (width * cameraZoom);

  const screenYAtCenter =
    baselineY + scaleFactor * (height / 2 + translateY / zoom - height / (2 * zoom));

  if (labels && labels.yLabelPosition == 'center') {
    return projection.yToWorld(clamp(screenYAtCenter, -GRID_SIZE_2D, GRID_SIZE_2D));
  }

  const edgeMarginPx = 30;

  const screenYAtTopMargin =
    baselineY + scaleFactor * (height / 2 + translateY / zoom - edgeMarginPx / zoom);

  return projection.yToWorld(clamp(screenYAtTopMargin, -GRID_SIZE_2D, GRID_SIZE_2D));
}
