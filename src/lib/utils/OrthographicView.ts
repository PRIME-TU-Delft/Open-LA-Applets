import { MathVector3 } from './MathVector';

export type OrthographicView = {
  cameraPosition: MathVector3;
  cameraTarget: MathVector3;
  cameraZoom: number;
};

/**
 * Compute a camera position, target and zoom that frames an axis-aligned box
 * of size `viewBoxSize` centred on `viewBoxCenter`, viewed from the given
 * azimuth/elevation, so that it fits within `width` x `height` pixels.
 */
export function computeOrthographicView(
  viewBoxSize: [number, number, number],
  viewBoxCenter: MathVector3,
  azimuth: number,
  elevation: number,
  width: number,
  height: number,
  margin = 0.7
): OrthographicView {
  const [sx, sy, sz] = viewBoxSize;

  //
  // Camera direction
  //
  const forward = new MathVector3(
    Math.sin(azimuth) * Math.cos(elevation),
    Math.cos(azimuth) * Math.cos(elevation),
    Math.sin(elevation)
  ).normalize();

  //
  // Camera basis
  //
  const worldUp = new MathVector3(0, 0, 1);

  let right = worldUp.clone().cross(forward);

  // Handle looking almost straight up/down
  if (right.length() < 1e-8) {
    right = new MathVector3(1, 0, 0);
  } else {
    right.normalize();
  }

  const up = forward.clone().cross(right).normalize();

  //
  // Project axis-aligned box onto camera plane
  //
  const halfWidth =
    0.5 * (Math.abs(right.mathX) * sx + Math.abs(right.mathY) * sy + Math.abs(right.mathZ) * sz);

  const halfHeight =
    0.5 * (Math.abs(up.mathX) * sx + Math.abs(up.mathY) * sy + Math.abs(up.mathZ) * sz);

  //
  // Compute orthographic zoom
  //
  const zoomX = (margin * width) / (2 * halfWidth);
  const zoomY = (margin * height) / (2 * halfHeight);

  const cameraZoom = Math.min(zoomX, zoomY);

  //
  // Camera position
  //
  const boundingRadius = 0.5 * Math.sqrt(sx * sx + sy * sy + sz * sz);

  const cameraDistance = 3 * boundingRadius;

  const cameraPosition = viewBoxCenter.clone().add(forward.clone().multiplyScalar(cameraDistance));

  return {
    cameraPosition,
    cameraTarget: viewBoxCenter,
    cameraZoom
  };
}
