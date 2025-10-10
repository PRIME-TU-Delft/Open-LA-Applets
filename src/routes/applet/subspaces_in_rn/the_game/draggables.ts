import { Vector2 } from 'three';

export function snapToLine(v: Vector2, direction: Vector2) {
  const dot = v.dot(direction.normalize());
  return direction.clone().multiplyScalar(dot);
}

export function snapToMaxDistance(v: Vector2, maxDist: number) {
  const length = v.length();

  if (length < maxDist) {
    return v;
  } else {
    return v.normalize().multiplyScalar(maxDist);
  }
}

export function snapToAxis(v: Vector2) {
  if (Math.abs(v.x) > Math.abs(v.y)) {
    return new Vector2(v.x, 0);
  } else {
    return new Vector2(0, v.y);
  }
}

export function snapToFirstQuadrant(v: Vector2) {
  return new Vector2(Math.max(v.x, 0), Math.max(v.y, 0));
}

export function snapToCone(v: Vector2) {
  if (Math.abs(v.x) > Math.abs(v.y)) {
    if (v.x > 0) {
      return new Vector2(v.x, Math.max(v.x, v.y));
    } else {
      return new Vector2(v.x, Math.min(v.x, v.y));
    }
  }

  if (v.y > 0) {
    return new Vector2(Math.max(v.x, 0), v.y);
  } else {
    return new Vector2(Math.min(v.x, 0), v.y);
  }
}

export const values: string[] = [
  'applets.subspaces_in_rn.the_game.disc',
  'applets.subspaces_in_rn.the_game.affine_line',
  'applets.subspaces_in_rn.the_game.two_axes',
  'applets.subspaces_in_rn.the_game.first_quadrant',
  'applets.subspaces_in_rn.the_game.two_sided_cone'
];
