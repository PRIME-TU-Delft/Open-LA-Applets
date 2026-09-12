import type { Transform2D } from '$lib/stores/camera.svelte';
import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';
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

let cameraBaselineX: number | undefined;
let cameraBaselineY: number | undefined;

/**
 * CanvasD3 computes x and y as pan contribution plus initial camera baseline.
 * Capture that baseline once and remove it for viewport-relative label placement.
 * @param cameraTransform D3's camera transform
 * @returns camera position without baseline
 */
function revertCameraBaseline(cameraTransform: Transform2D | undefined): Transform2D | undefined {
  if (!cameraTransform) return undefined;
  if (cameraBaselineX === undefined) {
    cameraBaselineX = cameraTransform.x;
  }
  if (cameraBaselineY === undefined) {
    cameraBaselineY = cameraTransform.y;
  }

  return {
    ...cameraTransform,
    x: cameraTransform.x - cameraBaselineX,
    y: cameraTransform.y - cameraBaselineY
  } as Transform2D;
}

export function getXLabelX(
  cameraTransform: Transform2D | undefined,
  width: number,
  cameraZoom: number,
  labels: LabelProps | undefined,
  projection: Projection2D = IDENTITY_PROJECTION
): number {
  const normalizedCamera = revertCameraBaseline(cameraTransform);
  if (!cameraTransform || !normalizedCamera) return projection.xToWorld(6.8);

  const baselineX = cameraBaselineX ?? 0;
  const normalizedPanX = normalizedCamera.x;
  const zoom = Math.max(cameraTransform.k, 1e-6);
  const totalZoom = zoom * cameraZoom;

  const screenXAtCenter = baselineX - 7.5 / cameraZoom + (7.5 + normalizedPanX) / totalZoom;

  if (labels && labels.xLabelPosition == 'center') {
    return projection.xToWorld(clamp(screenXAtCenter, -GRID_SIZE_2D, GRID_SIZE_2D));
  }

  const edgeMarginPx = 48;

  const rightEdgeFactor = 15 * (1 - edgeMarginPx / width);

  const screenXAtRight =
    baselineX - 7.5 / cameraZoom + (rightEdgeFactor + normalizedPanX) / totalZoom;

  return projection.xToWorld(clamp(screenXAtRight, -GRID_SIZE_2D, GRID_SIZE_2D));
}

export function getYabelY(
  cameraTransform: Transform2D | undefined,
  width: number,
  height: number,
  cameraZoom: number,
  labels: LabelProps | undefined,
  projection: Projection2D = IDENTITY_PROJECTION
): number {
  const normalizedCamera = revertCameraBaseline(cameraTransform);
  if (!cameraTransform || !normalizedCamera) return projection.yToWorld(6.25);

  const baselineY = cameraBaselineY ?? 0;
  const normalizedPanY = normalizedCamera.y;
  const zoom = Math.max(cameraTransform.k, 1e-6);

  const translateY = (normalizedPanY * width) / 15;
  const scaleFactor = 15 / (width * cameraZoom);

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
