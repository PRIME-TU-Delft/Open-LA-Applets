import { Vector2 } from 'three';
import type { LocalizedString } from '$lib/utils';

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

export const values: LocalizedString[] = [
  { en: 'Disc', nl: 'Schijf' },
  { en: 'Affine Line', nl: 'Affiene Lijn' },
  { en: 'Two axes', nl: 'Twee assen' },
  { en: 'First quadrant', nl: 'Eerste kwadrant' },
  { en: 'Two-sided cone', nl: 'Tweezijdige kegel' }
];
