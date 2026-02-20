import type { Transform2D } from '$lib/stores/camera.svelte';
import type { Vector2 } from 'three';

export type LabelProps = {
  xLabel?: string;
  yLabel?: string;
  xLabelPosition?: 'center' | 'end';
  xLabelOffset?: Vector2;
  yLabelPosition?: 'center' | 'top';
  yLabelRotate?: boolean;
  yLabelOffset?: Vector2;
  size?: number;
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
  labels: LabelProps | undefined
): number {
  const edgeMarginPx = 64;

  const normalizedCamera = revertCameraBaseline(cameraTransform);
  if (!cameraTransform || !normalizedCamera) return 6.8;

  const baselineX = cameraBaselineX ?? 0;
  const normalizedPanX = normalizedCamera.x;
  const zoom = Math.max(cameraTransform.k, 1e-6);

  const rightEdgeFactor = 15 * (1 - edgeMarginPx / width);

  if (labels && labels.xLabelPosition == 'center') {
    return baselineX + normalizedPanX;
  }

  return baselineX - 7.5 + (rightEdgeFactor + normalizedPanX) / zoom;
}

export function getYabelY(
  cameraTransform: Transform2D | undefined,
  width: number,
  height: number,
  labels: LabelProps | undefined
): number {
  const edgeMarginPx = 88;

  const normalizedCamera = revertCameraBaseline(cameraTransform);
  if (!cameraTransform || !normalizedCamera) return 6.25;

  const baselineY = cameraBaselineY ?? 0;
  const normalizedPanY = normalizedCamera.y;
  const zoom = Math.max(cameraTransform.k, 1e-6);

  const translateY = (normalizedPanY * width) / 15;

  const worldYAtTopMargin =
    baselineY + (15 / width) * (height / 2 + translateY / zoom - edgeMarginPx / zoom);

  if (labels && labels.yLabelPosition == 'center') {
    return baselineY + normalizedPanY;
  }

  return worldYAtTopMargin;
}
