import { Vector2 } from 'three';

export const POLYGON_LABEL_OFFSET = 0.15;

export function outwardSideNormal(pStart: Vector2, pEnd: Vector2, center: Vector2): Vector2 {
  const edge = pEnd.clone().sub(pStart);
  if (edge.lengthSq() < 1e-12) return new Vector2(0, 0);
  const normal = new Vector2(-edge.y, edge.x);
  const midpoint = pStart.clone().add(pEnd).multiplyScalar(0.5);
  if (normal.dot(midpoint.clone().sub(center)) < 0) normal.negate();
  return normal;
}

export function outwardLabelOffset(
  direction: Vector2,
  magnitude: number
): { offset: Vector2; alignX: 'left' | 'right'; alignY: 'top' | 'bottom' } {
  const offset =
    direction.lengthSq() < 1e-12
      ? new Vector2(0, magnitude)
      : direction.clone().normalize().multiplyScalar(magnitude);
  const alignX = offset.x > 1e-6 ? 'left' : 'right';
  const alignY = offset.y < -1e-6 ? 'top' : 'bottom';
  return { offset, alignX, alignY };
}
