import { Draggable } from '$lib/controls/Draggables.svelte';
import { PrimeColor } from '$lib/utils/PrimeColors';
import { X } from 'lucide-svelte';
import { Vector2 } from 'three';

function snapToLine(v: Vector2, direction: Vector2) {
  const dot = v.dot(direction.normalize());
  return direction.clone().multiplyScalar(dot);
}

function snapToMaxDistance(v: Vector2, maxDist: number) {
  const length = v.length();

  if (length < maxDist) {
    return v;
  } else {
    return v.normalize().multiplyScalar(maxDist);
  }
}

function snapToAxis(v: Vector2) {
  if (Math.abs(v.x) > Math.abs(v.y)) {
    return new Vector2(v.x, 0);
  } else {
    return new Vector2(0, v.y);
  }
}

function snapToFirstQuadrant(v: Vector2) {
  return new Vector2(Math.max(v.x, 0), Math.max(v.y, 0));
}

function snapToCone(v: Vector2) {
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

export const values = ['Affine Line', 'Disc', 'Two axes', 'First quadrant', 'Two-sided cone'];

export function getDraggables(type: (typeof values)[number]) {
  switch (type) {
    case 'Affine Line':
      return [
        new Draggable(new Vector2(2, 2), PrimeColor.darkGreen, 'u', (v) =>
          snapToLine(v, new Vector2(1, 1))
        ),
        new Draggable(new Vector2(1, 1), PrimeColor.orange, 'v', (v) =>
          snapToLine(v, new Vector2(1, 1))
        )
      ];
    case 'Disc':
      return [
        new Draggable(new Vector2(1, 1), PrimeColor.darkGreen, 'u', (v) =>
          snapToMaxDistance(v, 2.5)
        ),
        new Draggable(new Vector2(1, -2), PrimeColor.orange, 'v', (v) => snapToMaxDistance(v, 2.5))
      ];
    case 'Two axes':
      return [
        new Draggable(new Vector2(2, 0), PrimeColor.darkGreen, 'u', (v) => snapToAxis(v)),
        new Draggable(new Vector2(1, 0), PrimeColor.orange, 'v', (v) => snapToAxis(v))
      ];
    case 'First quadrant':
      return [
        new Draggable(new Vector2(2, 1), PrimeColor.darkGreen, 'u', (v) => snapToFirstQuadrant(v)),
        new Draggable(new Vector2(1, 2), PrimeColor.orange, 'v', (v) => snapToFirstQuadrant(v))
      ];
    case 'Two-sided cone':
      return [
        new Draggable(new Vector2(1, 3), PrimeColor.darkGreen, 'u', (v) => snapToCone(v)),
        new Draggable(new Vector2(1, 1), PrimeColor.orange, 'v', (v) => snapToCone(v))
      ];
  }
  return [];
}

export function getSplitDraggables(type: (typeof values)[number]) {
  return [getDraggables(type)[0].clone()];
}
